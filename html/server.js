var conn;
window.onload = function () {
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
 		conn.send("monitor HTML");
	};
	document.getElementById("say").addEventListener("keyup", onkeyup);
}

const rm = 100;
var rc = 0;
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
	if(e.indexOf("users") == 0) {
		// Skip
		return;
	}
	if(e.indexOf("clients") == 0) {
		e = e.replace(/ /g, ",").split(",");
		if(e[1] == "*") {
			document.getElementById("users").innerHTML = "";
			return;
		}
		let g = document.getElementById("b" + e[1] + "g" + e[2]);
		if(g == null) {
			document.getElementById("users").innerHTML +=
				"<div id=b" + e[1] + "g" + e[2] + ">"
				+ "<div class=g onclick='console(" + e[1] + "," + e[2] + ")'"
				+ ">Band " + e[1] + ", Group " + e[2] + "</div>"
				+ "</div>";
			g = document.getElementById("b" + e[1] + "g" + e[2]);
		}
		for(let i=3; i<e.length; i++) {
			g.innerHTML += "<div class=c id=" + e[i] + ">" + e[i] + "</div>";
		}
		return;
	}
	if(e.indexOf("monitors") == 0) {
		e = e.replace(/ /g, ",").split(",");
		let m = document.getElementById("m");
		if(m == null) {
			document.getElementById("users").innerHTML += 
				"<div id=ms>"
				+ "<div onclick='console(-1, -1)'>Monitors</div>"
				+ "</div>";
			m = document.getElementById("ms");
		}
		for(let i=1; i<e.length; i++) {
			if(name == e[i])
				m.innerHTML += "<div class=m id=" + e[i] + ">[" + e[i] + "]</div>";
			else m.innerHTML += "<div class=m id=" + e[i] + ">" + e[i] + "</div>";
		}
		return;
	}
	{
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
function console(b, g) {
	conn.send("console " + b + " " + g);
}
function onkeyup(e) {
	if(e.keyCode == 13) {
		send();
	}
}
function send() {
	let say = document.getElementById("say");
	if(say.value.length > 0) {
 		conn.send(say.value);
		say.value = "";
	}
}
