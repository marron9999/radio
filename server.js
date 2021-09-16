const http = require('http')
const express = require('express')
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const bodyParser = require('body-parser');

const log = require('./log.js').log;
//log.set(2);

let port = 8888;
let app = null;
let server = null;
let wss = null;
let online = {};
let monitor = {};

let plugin_band  = {
	"83": require('./maze/maze.js'),
	"82": require('./highlow/highlow.js'),
	"81": require('./othello/othello.js'),
	"80": require('./startrek/startrek.js'),
	"79": require('./parrot/parrot.js')
};
let plugin_group  = { };

const MSG_STOP = "stop";

function stop() {
	let url = "ws://localhost:"+port;
	console.log("Connect " + url);
	wss = new WebSocket(url);
	wss.on('open', function () {
		try {
			console.log("Send " + MSG_STOP);
			wss.send(MSG_STOP);
		} catch (e) {
			console.log(e);
		}
		wss.close();
	});
	wss.on('close', function () {
		console.log("Close " + url);
	});
}

function start() {
	log.info("", "Start express+wss:" + port);

	app = express();
	app.use(express.static('html'));
	app.use("/scratch", express.static('../scratch'));
	app.use(bodyParser.text({type:'text/html'}));
	app.use(express.static('html'));

	server = http.createServer(app);
	let posts = log.posts();
	for(let name in posts) {
		app.post("/" + name, posts[name]);
	}

	wss = new WebSocketServer({server:server});
	wss.on('connection', function (ws, req) {
		ws.id = wsid(ws._socket, req);
		log.connect(ws.id + " connect");
		log.info("", ws.id + " connect");
		online[ws.id] = {ws:ws, band:0, group:0, user:null};
		title(online[ws.id]);
		monitors();
		ws.on('close', function () {
			let ws = this;
			if(online[ws.id] != undefined) {
				let band = online[ws.id].band;
				let group = online[ws.id].group;
				log.info("", ws.id + " close");
				delete online[ws.id];
				users(band, group);
				monitors();
				plugin_close(band, group);
			}
			if(monitor[ws.id] != undefined) {
				log.info("", ws.id + " close");
				delete monitor[ws.id];
				monitors();
			}
		});
		ws.on('message', function (msg) {
			handle(this, "" + msg);
		});
	});

	server.listen(port);
}

function handle(ws, msg) {
	msg = "" + msg;
	//log.info("", ws.id + " " + msg);
	let band = -1;
	let group = -1;
	if(online[ws.id] != undefined) {
		band = online[ws.id].band;
		group = online[ws.id].group;
	}
	else if(monitor[ws.id] != undefined) {
		band = monitor[ws.id].band;
		group = monitor[ws.id].group;
	}

	if(msg.indexOf("bands") == 0) {
		let bs = bands();
		ws.send("bands " + bs);
		return;
	}
	if(msg.indexOf("groups") == 0) {
		let band = parseInt(msg.substr(7).trim());
		let gs = groups(band);
		ws.send("groups " + band + " " + gs);
		return;
	}
	if(msg.indexOf("clients") == 0) {
		let p = msg.indexOf(" ");
		msg = msg.substr(p+1).trim();
		p = msg.indexOf(" ");
		let band = parseInt(msg.substr(0, p));
		msg = msg.substr(p+1).trim();
		let group = parseInt(msg);
		let cs = clients(band, group);
		ws.send("clients " + band + " " + group + " " + cs);
		return;
	}

	if(msg == MSG_STOP) {
		log.info("", "Close express+wss:" + port);
		wss.close();
		server.close();
		return;
	}

	if(monitor[ws.id] != undefined) {
		if(msg.indexOf("console") == 0) {
			if(monitor[ws.id] != undefined) {
				let p = msg.indexOf(" ");
				msg = msg.substr(p+1).trim();
				p = msg.indexOf(" ");
				band = parseInt(msg.substr(0, p));
				msg = msg.substr(p+1).trim();
				group = parseInt(msg);
				monitor[ws.id].band = band;
				monitor[ws.id].group = group;
				title(monitor[ws.id]);
			}
			return;
		}
	}

	if(online[ws.id] != undefined) {
		if(msg.indexOf("monitor") == 0) {
			if(monitor[ws.id] == undefined) {
				delete online[ws.id];
				users(band, group);
				monitor[ws.id] = {ws:ws, band:-1, group:-1, user:null};
				msg = msg.substr(4).trim();
				let p = msg.indexOf(" ");
				if(p > 0) {
					monitor[ws.id].user = msg.substr(p+1).trim();
				}
				title(monitor[ws.id]);
				monitors();
			}
			return;
		}

		if(msg.indexOf("band") == 0) {
			online[ws.id].user = null;
			msg = msg.substr(4).trim();
			let p = msg.indexOf(" ");
			if(p > 0) {
				online[ws.id].user = msg.substr(p+1).trim();
				msg = msg.substr(0, p);
			}
			online[ws.id].band = parseInt(msg);
			plugin_close(band, group);
			title(online[ws.id]);
			band = online[ws.id].band;
			users(band, group);
			monitors();
			return;
		}
		if(msg.indexOf("group") == 0) {
			online[ws.id].group = parseInt(msg.substr(5).trim());
			plugin_close(band, group);
			group = online[ws.id].group;
			users(band, group);
			title(online[ws.id]);
			monitors();
			plugin_open(online[ws.id].band, online[ws.id].group);
			return;
		}
	}

	let wsx = [];
	wsx[0] = [ws];
	wsx[1] = [];

	for(let id in online) {
		if(id != ws.id
		&& online[id].band  == band
		&& online[id].group == group) {
			wsx[0].push(online[id].ws);
		}
	}
	for(let id in monitor) {
		if(monitor[id].band  == band
		&& monitor[id].group == group) {
			wsx[1].push(monitor[id].ws);
		}
	}

	message(ws.id, band, group, msg);

	if(online[ws.id] != undefined) {
		try {
			plugin_message(wsx, band, group, msg);
		} catch(e) {
			console.error(e);
		}
	}
}

function plugin_message(ws, band, group, msg) {
	if(plugin_band[""+band] == undefined) return false;
	let gs = plugin_group[""+band];
	if(gs == undefined) return false;
	if(gs[""+group] == undefined) return false;
	//log.info("", band + " gs[" + group + "].message()");
	gs[""+group].message(ws, msg);
}

function plugin_close(band, group) {
	if(plugin_band[""+band] == undefined) return false;
	let cs = clients(band, group);
	if(cs.length <= 0) {
		let gs = plugin_group[""+band];
		if(gs == undefined) return false;
		if(gs[""+group] == undefined) return false;
		log.info("", band + " gs[" + group + "].close()");
		gs[""+group].close();
		log.info("", band + " delete gs[" + group + "]");
		delete gs["" + group];
	}
	return true;
}

function plugin_open(band, group) {
	if(plugin_band[""+band] == undefined) return false;
	let gs = plugin_group[""+band];
	if(gs == undefined) {
		gs = {};
		plugin_group[""+band] = gs;
	}
	if(gs[""+group] == undefined) {
		gs[""+group] = plugin_band[""+band].plugin(group);
	}
	log.info("", band + " gs[" + group + "].open()");
	gs[""+group].open();
	return true;
}

function title(e) {
	let m = "title " + e.ws.id;
	if(e.user != null)
		m += " " + e.user;
	m += " " + e.band + " " + e.group;
	e.ws.send(m);
	users(e.band, e.group);
}

function users(b, g) {
	let cs = clients(b, g);
	for(let i=0; i<cs.length; i++) {
		let id = cs[i].split("(")[0];
		online[id].ws.send("users " + b + " " + g + " " + cs);
	}
}

function monitors() {
	let ms = [];
	let bs = bands();
	for(let b=0; b<bs.length; b++) {
		let gs = groups(bs[b]);
		for(let g=0; g<gs.length; g++) {
			let cs = clients(bs[b], gs[g]);
			ms.push("clients " + bs[b] + " " + gs[g] + " " + cs);
		}
	}
	let x = [];
	for(let id in monitor) {
		if(monitor[id].user != null) {
			x.push(id + "(" + monitor[id].user + ")");
		} else {
			x.push(id);
		}
	}
	ms.push("monitors " + x);
	x = [];
	for(let id in monitor) {
		try {
			monitor[id].ws.send("clients *");
		} catch(e) {
			x.push(id);
		}
	}
	for(let m=0; m<ms.length; m++) {
		for(let id in monitor) {
			try {
				monitor[id].ws.send(ms[m]);
			} catch(e) {
				x.push(id);
			}
		}
	}
	for(let m=0; m<x.length; m++) {
		delete monitor[x[m]];
	}
}

function bands() {
	let bs = [];
	for(let id in online) {
		if(bs.indexOf(online[id].band) < 0) {
			bs.push(online[id].band);
		}
	}
	bs.sort();
	return bs;
}

function groups(band) {
	let gs = [];
	for(let id in online) {
		if(online[id].band == band) {
			if(gs.indexOf(online[id].group) < 0) {
				gs.push(online[id].group);
			}
		}
	}
	gs.sort();
	return gs;
}

function clients(band, group) {
	let cs = [];
	for(let id in online) {
		if(online[id].band == band
		&& online[id].group == group) {
			if(online[id].user == null) {
				cs.push(id);
			} else {
				cs.push(id + "(" + online[id].user + ")");
			}
		}
	}
	cs.sort();
	return cs;
}

function message(ws_id, band, group, msg) {
	let x = [];	
	for(let id in online) {
		if(ws_id != id) {
			try {
				if(online[id].band == band
				&& online[id].group == group) {
					online[id].ws.send(msg);
				}
			} catch (e) {
				online[id].band = -1;
				online[id].group = -1;
				x.push({id:id, error:e});
			}
		}
	}
	if(x.length > 0) {
		for(let i = 0; i < x.length; i++) {
			log.error("", x[i].id + " catch:" + x[i].error);
			delete online[x[i].id];
		}
		monitors();
	}
	x = 0;
	for(let id in monitor) {
		try {
			if(monitor[id].band == band
			&& monitor[id].group == group) {
				monitor[id].ws.send(ws_id + " " + msg);
			}
		} catch (e) {
			monitor[id].band = -1;
			monitor[id].group = -1;
			x = 1;
			log.error("", id + " catch:" + e);
		}
	}
	if(x > 0) {
		monitors();
	}
}

function wsid(socket, req) {
	let a = null;
	if(req != undefined && req != null) {
		a = req.headers['x-forwarded-for'];
		if(a == null)
			a = req.connection.remoteAddress;
	}
	if(a == null)
		a = socket.remoteAddress;
	a = a.substring(a.lastIndexOf(":")+1);
	a = a + ":" + socket.remotePort;
	return a;
}

if(process.argv.length >= 3) {
	port = parseInt(process.argv[2]);
}
if(process.argv.length >= 4) {
	if(process.argv[3] == "stop") {
		stop();
	} else {
		start();
	}
} else {
	start();
}
