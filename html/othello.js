var conn;
var band = 81;
var group = 0;

window.onload=function() {
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
	conn.onmessage = message;
	conn.onopen = function() {
		conn.send("band " + band);
		conn.send("group " + group);
		conn.send("S:start");
	};
	let h = "";
	for(let y=0; y<8; y++) {
		h += "<div>";
		for(let x=0; x<8; x++) {
			h += "<div onclick='select(this)'><div id=" + y + "-" + x + " class=x></div></div>";
		}
		h += "</div>";
	}
	document.getElementById("othello").innerHTML = h;
};

function message(msg) {
	msg = msg.data;
	let v = msg.split(" ");
	if(v[0] == "S:board") {
		let y = parseInt(v[1]);
		for(let x = 0; x < 8; x++) {
			let c = v[2].charAt(x);
			if(c == "#") {
				document.getElementById(y + "-" + x).className = "w";
			} else if(c == "*") {
				document.getElementById(y + "-" + x).className = "b";
			}
		}
		return;
	}
	if(v[0] == "S:play") {
		let e = document.getElementById("you");
		e = e.getElementsByTagName("span");
		e[1].innerHTML = "(" + v[1] + "," + v[2] + ")";
		stat("You: " + v[1] + "," + v[2]);
	}
	if(v[0] == "S:ai") {
		let e = document.getElementById("ai");
		e = e.getElementsByTagName("span");
		e[1].innerHTML = "(" + v[1] + "," + v[2] + ")";
		stat("AI: " + v[1] + "," + v[2]);
		e = document.getElementById(v[2] + "-" + v[1]);
		if(e != null) {
			e = e.parentElement;
			e.style.background = "#080";
			setTimeout(function() {
				e.style.background = null;
			}, 1000);
		}
		return;
	}
	if(v[0] == "S:black") {
		let e = document.getElementById("you");
		e = e.getElementsByTagName("span");
		e[0].innerHTML = v[1];
		return;
	}
	if(v[0] == "S:inv") {
		let e = document.getElementById("you");
		e = e.getElementsByTagName("span");
		e[1].innerHTML = "Error";
		stat("You: " + "Error");
		return;
	}
	if(v[0] == "S:white") {
		let e = document.getElementById("ai");
		e = e.getElementsByTagName("span");
		e[0].innerHTML = v[1];
		return;
	}
	if(v[0] == "S:pass") {
		let e = document.getElementById("ai");
		e = e.getElementsByTagName("span");
		e[1].innerHTML = "Pass";
		stat("AI: " + "Pass");
		return;
	}
	if(v[0] == "S:you") {
		stat("You: " + v[1]);
		return;
	}
}

function stat(val) {
	let e = document.getElementById("stat");
	let x = e.getElementsByTagName("div");
	if(x.length >= 10) {
		x = e.innerHTML.indexOf("</div>");
		e.innerHTML = e.innerHTML.substr(x+1+1+3+1);
	}
	e.innerHTML += "<div>" + val + "</div>";
}

function select(e) {
	let c = e.children[0];
	if(c.className != "x") return;
	e.style.background = "#080";
	setTimeout(function() {
		e.style.background = null;
	}, 1000);
	let n = c.id.split("-");
	conn.send("S:play " + n[1] + " " + n[0]);
}

