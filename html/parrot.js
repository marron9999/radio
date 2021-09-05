const rm = 100;
var rc = 0;
var conn;
var band = 80;
var group = 0;
window.onload = function () {
	let q = location.search;
	if(q == null) q = "";
	else q = q.substr(1);
	q = q.split("&");
	if(q.length > 0 && q[0] != "") {
		group = parseInt(q[0]);
	}
	var ws = "ws";
	var host = window.location.hostname;
	var port = null;
	if(host == null
	|| host == "") {
		host = "localhost";
		port = "8888";
	} else {
		port = window.location.port;
	}
	if(port == null
	|| port == "") port = "80";
	conn = new WebSocket(ws + "://" + host + ":" + port);
	conn.onmessage = onmessage;
	conn.onopen = function() {
		conn.send("band " + band);
		conn.send("group " + group);
	};
	document.getElementById("say").addEventListener("keyup", onkeyup);
}

var select = null;
var name = "";
function onmessage(e) {
	e = e.data;
	if(e.indexOf("title") == 0) {
		let p = e.indexOf(" ");
		document.title = e.substr(p+1).trim();
		name = document.title.substr(0, document.title.indexOf(" "));
		return;
	}
	if(e.indexOf("S:") == 0) {
		e = e.substr(2);
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
		return;
	}
}
function onkeyup(e) {
	if(e.keyCode == 13) {
		send();
	}
}
function send() {
	let say = document.getElementById("say");
	conn.send("S:" + say.value);
	say.value = "";
}
