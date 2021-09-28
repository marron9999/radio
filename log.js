const fs = require('fs');
const path = require('path');
const moment = require('moment');
const {exec} = require('child_process')

const ROOT = "../radio.log";

let trace = 1;
	// 3: error
	// 2: warn
	// 1: info

function date() {
	//let d = new Date();
	//let f = function(v, n) { v = "000" + v; return v.substr(v.length - n); };
	//let s = f(d.getHours(), 2) + ":" + f(d.getMinutes(), 2)
	//		+ ":" +  f(d.getSeconds(), 2) + "." + f(d.getMilliseconds(), 3);
	//d = f(d.getFullYear(), 4) + "/" + f(d.getMonth()+1, 2) + "/" + f(d.getDate(), 2);
	//d = d + " " + s;
	let d = moment().format("YYYY/MM/DD HH:mm:ss.SSS")
	return d;
}
function yyyymmdd() {
	let d = new Date();
	let f = function(v, n) { v = "000" + v; return v.substr(v.length - n); };
	d = f(d.getFullYear(), 4) + f(d.getMonth()+1, 2) + f(d.getDate(), 2);
	return d;
}
function file(id, ext) {
	if(id == "") id = "_";
	id = ROOT + "/" + id + "." + ext;
	return id;
}
function load(id, ext) {
	try { id = fs.readFileSync(file(id, ext)); }
	catch (err) { id = ""; }
	return id;
}

function store(id, ext, body) {
	try {
		fs.appendFileSync(file(id, ext),
			date() + "\t" + body + "\n");
	} catch (err) {
		console.log(err);
	}
}

function console_log(id, text) {
	if(text == undefined) {
		text = id;
		id = null;
	}
	//console.log(text);
	if(id == null) {
		console.log(text);
		return;
	}
	store(yyyymmdd() + "_" + id, "log", text);
}
const log = {
	info: function(id, text) { if(trace <= 1) console_log(id, text); },
	warn: function(id, text) { if(trace <= 2) console_log(id, text); },
	error: function(id, text) { if(trace <= 3) console_log(id, text); },
	connect: function(text) { store(yyyymmdd(), "log", text); },
	set: function(level) { trace = level; },
	posts: function() {
		return {
			post : function(req, res) {
				//log.info("", "post - req: " + JSON.stringify(req));
				log.info("", "post - start");
				if(req.connection != "close") {
					post_(req.body, res);
					return;
				}
				var body = "";
				req.on('error', function(error) {
					log.info("", "post - error:" + error);
				});
				req.on('data', function(chunk) {
					log.info("", "post - data");
					body += chunk;
				});
				req.on('end', function() {
					log.info("", "post - end");
					post_(body, res);
				});
			},
			load: function(req, res) {
				let id = decodeURIComponent(req.body);
				log.info("", "load:" + id);
				let body = encodeURIComponent(load(id, "txt"));
				res.send(body);
			},
			log: function(req, res) {
				let id = decodeURIComponent(req.body);
				log.info("", "log:" + id);
				let body = encodeURIComponent(load(id, "log"));
				res.send(body);
			},
			dir: function(req, res) {
				let ls = fs.readdirSync(ROOT);
				log.info("", "dir:" + ROOT);
				let body = "";
				ls.forEach(file => {
					if (path.extname(file) == ".txt") {
						let d = fs.statSync(ROOT + "/" + file);
						let r = fs.readFileSync(ROOT + "/" + file);
						d = moment(d.mtime).format("YYYY/MM/DD HH:mm:ss.SSS");
						r = "" + r;
						if(r != "") {
							r = r.split("\n");
							if(r[r.length - 1] == "")
								r = r[r.length - 2];
							else r = r[r.length - 1];
							let p = r.indexOf("\t");
							r = r.substr(p+1);
							p = r.indexOf("\t");
							r = r.substr(p+1);
						}
						body += path.basename(file) + "\t" + d + "\t" + r + "\n";
					}
				});
				body = encodeURIComponent(body);
				res.send(body);
			}
		};
	}
};

function post_(body, res) {
	body = decodeURIComponent(body);
	log.info("", "post:" + body);
	let p = body.indexOf("\t");
	let id = body.substr(0, p);
	body = body.substr(p + 1);
	store(id, "txt", body);
	body = encodeURIComponent(load(id, "txt"));
	res.send(body);
	if(config.post != undefined) {
		log.info("", "slack:" + body);
		slack(config.post.slack,
			date + " /" + path + " " + body.substr(0, p) + "\n"
			+ body.substr(p+1)
		);
	}
}

module.exports = { log };
