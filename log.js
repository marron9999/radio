const fs = require('fs');
const path = require('path');
const moment = require('moment');

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
	id = log.ROOT + "/" + id + "." + ext;
	return id;
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
	save(yyyymmdd() + "_" + id, "log", text);
}

function save(id, ext, body) {
	try {
		fs.appendFileSync(file(id, ext),
			date() + "\t" + body + "\n");
	} catch (err) {
		console.log(err);
	}
}

const log = {
	ROOT: "../radio.log",
	trace: 1,
		// 3: error
		// 2: warn
		// 1: info
	//set: function(level) { log.trace = level; },
	info: function(id, text) { if(log.trace <= 1) console_log(id, text); },
	warn: function(id, text) { if(log.trace <= 2) console_log(id, text); },
	error: function(id, text) { if(log.trace <= 3) console_log(id, text); },
	connect: function(text) { save(yyyymmdd(), "log", text); },
	load: function (id, ext) {
		try { id = fs.readFileSync(file(id, ext)); }
		catch (err) { id = ""; }
		return id;
	},
	store: function(id, ext, body) {
		save(id, ext, body);
	}
};

module.exports = { log };
