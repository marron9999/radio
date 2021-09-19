const fs = require('fs');

let trace = 1;
	// 3: error
	// 2: warn
	// 1: info

function date() {
	let d = new Date();
	let f = function(v, n) { v = "000" + v; return v.substr(v.length - n); };
	let s = f(d.getHours(), 2) + ":" + f(d.getMinutes(), 2)
			+ ":" +  f(d.getSeconds(), 2) + "." + f(d.getMilliseconds(), 3);
	d = f(d.getFullYear(), 4) + "/" + f(d.getMonth()+1, 2) + "/" + f(d.getDate(), 2);
	d = d + " " + s;
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
	id = "../radio.log/" + id + "." + ext;
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
				let body = decodeURIComponent(req.body);
				let p = body.indexOf("\t");
				let id = body.substr(0, p);
				body = body.substr(p + 1);
				store(id, "txt", body);
				body = encodeURIComponent(load(id, "txt"));
				res.send(body);
			},
			load: function(req, res) {
				let id = decodeURIComponent(req.body);
				let body = encodeURIComponent(load(id, "txt"));
				res.send(body);
			}
		};
	}
};

module.exports = { log };
