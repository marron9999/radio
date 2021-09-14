const rm = 100;
var rc = [];
var conn=[];
var band = 79;
var group = 0;
window.onload = function () {
	let url = wspath();
	for(let i=0; i<4; i++) {
		rc[i] = 0;
		conn[i] = new WebSocket(url);
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
