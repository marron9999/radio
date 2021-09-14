var conn;
var band = 81;
var group = 0;

window.onload=function() {
	let url = wspath();
	conn = new WebSocket(url);
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
	if(msg.indexOf("title") == 0) {
		let p = msg.indexOf(" ");
		document.title = msg.substr(p+1).trim();
		return;
	}
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
	if(v[0] == "S:stone") {
		let x = parseInt(v[1]);
		let y = parseInt(v[2]);
		let c = v[3];
		let e = document.getElementById(y + "-" + x);
		if(c == "#") {
			if(e.className == "b"
			|| e.className == "wb")
				e.className = "bw";
			else e.className = "w";
			e = e.parentElement;
			e.style.background = "#080";
			setTimeout(function() {
				e.style.background = null;
			}, 1000);
		} else if(c == "*") {
			if(e.className == "w"
			|| e.className == "bw")
				e.className = "wb";
			else e.className = "b";
			e = e.parentElement;
			e.style.background = "#080";
			setTimeout(function() {
				e.style.background = null;
			}, 1000);
		}
		return;
	}
	if(v[0] == "S:play") {
		let e = document.getElementById("you");
		e = e.getElementsByTagName("span");
		e[1].innerHTML = "(" + v[1] + "," + v[2] + ")";
		stat("You: " + v[1] + "," + v[2]);
		return;
	}
	if(v[0] == "S:ai") {
		let e = document.getElementById("ai");
		e = e.getElementsByTagName("span");
		e[1].innerHTML = "(" + v[1] + "," + v[2] + ")";
		stat("AI: " + v[1] + "," + v[2]);
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
		e = document.getElementById(put[0] + "-" + put[1]);
		e = e.parentElement;
		e.style.background = "#080";
		setTimeout(function() {
			e.style.background = null;
		}, 1000);
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

let put = [];
function select(e) {
	let c = e.children[0];
	if(c.className != "x") return;
	e.style.background = "#080";
	//setTimeout(function() {
	//	e.style.background = null;
	//}, 1000);
	put = c.id.split("-");
	conn.send("S:play " + put[1] + " " + put[0]);
}

