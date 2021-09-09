const rm = 100;
var rc = [];
var conn=[];
var band = 79;
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
	for(let i=0; i<4; i++) {
		rc[i] = 0;
		conn[i] = new WebSocket(ws + "://" + host + ":" + port);
		conn[i].id = i;
		conn[i].onmessage = function(e) {
			message(i, e);
		};
		conn[i].onopen = function() {
			conn[i].send("band " + band);
			conn[i].send("group " + group);
		};
	}
	document.getElementById("say1").addEventListener("keyup", onkeyup);
	document.getElementById("say2").addEventListener("keyup", onkeyup);
	document.getElementById("say3").addEventListener("keyup", onkeyup);
	document.getElementById("say4").addEventListener("keyup", onkeyup);
}

var select = null;
var name = "";
function message(i, e) {
	e = e.data;
	if(e.indexOf("title") == 0) {
		let p = e.indexOf(" ");
		document.getElementById("name" + (i+1)).innerHTML = e.substr(p+1).trim();
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
		let c = document.getElementById("chat" + (i+1));
		c.innerHTML += "<div class=t>" + e + "</div>";
		if(rc[i]>rm) {
			let p = c.innerHTML.indexOf("</div>");
			c.innerHTML = c.innerHTML.substr(p+6);
		} else {
			rc[i]++;
		}
		c.scrollTo(0, 0x7fffffff);
		return;
	}
}
function onkeyup(e) {
	let i = event.target.id;
	if(e.keyCode == 13) {
		i = parseInt(i.charAt(i.length - 1));
		send(i);
	}
}
function send(i) {
	let say = document.getElementById("say" + i);
	if(say.value != "") {
		conn[i - 1].send("S:" + say.value);
		say.value = "";
	}
}
