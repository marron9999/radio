const rm = 100;
var rc = 0;
var conn;
var band = 82;
var group = 0;
let current = 0;
let max = 10;
let stat = null;

window.onload = function () {
	let url = wspath();
	conn = new WebSocket(url);
	conn.onmessage = onmessage;
	conn.onopen = function() {
		send("band " + band);
		sendGroup();
	};
}

let test =  null;
let over =  null;

let time = 0;

function game() {
	add("--- game ---");
	test = function(d) {
		d = d.split("=");
		if(d[0] == "V:game"
		&& d[1] == "" + serial) {
			highlow();
			return true;
		}
		return false;
	}
	over = function(d) {
		stat.innerHTML += " -";
		add("--- game:timeout ---");
		setTimeout(start0, 1000);
	}
	stat.innerHTML += " game?";
	send("V:game=" + serial);
	time = new Date().getTime() + 1000;
	setTimeout(scan, 100);
}

let n = 5;
let n0 = 0;
let n2 = 9;
function highlow() {
	add("--- highlow ---");
	test = function(d) {
		d = d.split("=");
		if(d[0] == "V:" + serial) {
			if(d[1] == "1") {
				add("--- highlow: *Hit* ---");
				stat.innerHTML += " *Hit*";
				setTimeout(start0, 1000);
				return true;
			}
			if(d[1] == "-1") {
				add("--- highlow: fail ---");
				stat.innerHTML += " fail";
				setTimeout(start0, 1000);
				return true;
			}
			if(d[1] == "0") stat.innerHTML += " ↓";
			else stat.innerHTML += " ↑";

			if(d[1] == "0") {
				n2 = n;
			} else {
				n0 = n;
			}
			let x = parseInt(Math.abs(n2 - n0) / 2);
			if(x == 0) x = 1;
			if(d[1] == "0") {
				n -= x;
			} else {
				n += x;
			}

			stat.innerHTML += " " + n + "?";
			send("V:" + serial + "=" + n);
			time = new Date().getTime() + 1000;
			setTimeout(scan, 1);
			return true;
		}
		return false;
	}
	over = function(d) {
		stat.innerHTML += " -";
		add("--- highlow:timeout ---");
		setTimeout(start0, 1000);
	}
	n = 5;
	n0 = 0;
	n2 = 9;
	stat.innerHTML += " " + n + "?"
	send("V:" + serial + "=" + n);
	time = new Date().getTime() + 1000;
	setTimeout(scan, 100);
}

function scan() {
	if(time < new Date().getTime()) {
		over();
		return;
	}
	while(data.length > 0) {
		let d = data[0];
		data.shift();
		if(test(d)) return;
	}
	if(data.length <= 0) {
		setTimeout(scan, 100);
	}
}

var data = [];
var name = "";
var serial = -1;

function number(name) {
	let p = name.indexOf(":");
	try {
		let d = name.substr(0,p).split(".");
		let n = 0;
		for(let i=0; i<d.length; i++) {
			if(d[i] == "") continue;
			n <<= 8;
			n += parseInt(d[i]);
		}
		n <<= 16;
		n += parseInt(name.substr(p+1));
		return n;
	} catch(e) {
		// NONE
	}
	return -1;
}

function onmessage(e) {
	e = e.data;
	if(e.indexOf("title") == 0) {
		let p = e.indexOf(" ");
		document.title = e.substr(p+1).trim();
		if(name == "") {
			name = document.title.substr(0, document.title.indexOf(" "));
			serial = number(name);
			start0();
		}
		return;
	}
	if(e.indexOf("S:") == 0
	|| e.indexOf("N:") == 0
	|| e.indexOf("V:") == 0) {
		data.push(e);
		add(e);
	}
}

function add(e) {
	e = e.replace(/&/g, "&amp;");
	e = e.replace(/\r/g, "\\r");
	e = e.replace(/\n/g, "\\n");
	e = e.replace(/\t/g, "\\t");
	e = e.replace(/</g, "&lt;");
	e = e.replace(/>/g, "&gt;");
	let c = document.getElementById("chat");
	c.innerHTML += "<div class=t>" + e + "</div>";
	if(rc>rm) {
		let p = c.innerHTML.indexOf("</div>");
		c.innerHTML = c.innerHTML.substr(p+6);
	} else {
		rc++;
	}
	c.scrollTo(0, 0x7fffffff);
}

function send(val) {
	add(">" + val);
	conn.send(val);
}
