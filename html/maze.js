let ws = null;
const wait = 1000;
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
let canvas = null;
let ctx = null;

let help = "";
let fin = 0;
let size = [-1, -1];
let goal = [-1, -1];
let view = [-1, -1, -1];
let see = {"0": "▲", "3":"▶", "6":"▼", "9":"◀"};
let xy = null;
let _z = null;
let min = -1;

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function draw(c, p) {
	ctx.beginPath();
	ctx.moveTo(10+p[0][0],5+p[0][1]);
	for(let i=1; i<p.length; i++) {
		ctx.lineTo(10+p[i][0],5+p[i][1]);
	}
	ctx.lineTo(10+p[0][0],5+p[0][1]);
	ctx.closePath();
	if(c == 2) ctx.fillStyle = 'rgb(255, 255, 192)';
	else if(c == 3) ctx.fillStyle = 'rgb(255, 192, 192)';
	else if(c == 0) ctx.fillStyle = 'rgb(192, 255, 255)';
	else ctx.fillStyle = 'rgb(192, 192, 192)';
	ctx.fill();
	ctx.lineWidth = 1;	
	ctx.strokeStyle = 'black';	
	ctx.stroke();
}
function info() {
	let e = document.getElementById("info1");
	e.innerHTML = "Size " + size[0] + "x" + size[1] + " Goal " + goal[0] + "," + goal[1];
	e = document.getElementById("info2");
	e.innerHTML = "Locate " + view[0] + "," + view[1] + " " + see[""+view[2]];
	if(fin)	e.innerHTML = "[Goal] " + e.innerHTML;
}
function info3() {
	min++;
	let h = "0" + parseInt(min / 60);
	let m = "0" + (min % 60);
	h = h.substr(h.length - 2);
	m = m.substr(m.length - 2);
	let e = document.getElementById("info3");
	e.innerHTML = "Time: " + h + ":" + m;
	setTimeout(info3, 60 * 1000);
}
function send() {
	if(view[0] <= 0) view[0] = 1;
	if(view[1] <= 0) view[1] = 1;
	if(view[0] >= size[0]+size[0]) view[0] = size[0]+size[0]-1;
	if(view[1] >= size[1]+size[1]) view[1] = size[1]+size[1]-1;
	if(view[0] == goal[0]
		&& view[1] == goal[1]) {
		fin = 1;
		ws.send("S:" + "r");
	}
	ws.send("S:" + "v " + view[0] + " " + view[1] + " " + view[2]);
}
function check(x, y) {
	x += view[0];
	y += view[1];
	let e = document.getElementById(x + "-" + y);
	if(e.className.indexOf('b0') >= 0) return true;
	if(e.className.indexOf('b2') >= 0) return true;
	if(e.className.indexOf('b3') >= 0) return true;
	if(e.className.indexOf('z0') >= 0) return true;
	if(e.className.indexOf('z2') >= 0) return true;
	if(e.className.indexOf('z3') >= 0) return true;
	return false;
}
function door(x, y) {
	x += view[0];
	y += view[1];
	let e = document.getElementById(x + "-" + y);
	if(e.className.indexOf('b2') >= 0) return true;
	if(e.className.indexOf('z2') >= 0) return true;
	return false;
}
function keydown(event){
	help += event.key;
	if(help == "h"
	|| help == "he"
	|| help == "hel"
	|| help == "help") ;
	else help = "";
	var code = event.keyCode;
	if (code == 39) { // 右
		view[2] = (view[2] + 3) % 12;
		send();
		return;
	}
	if (code == 37) { // 左
		view[2] = (view[2] + 12 - 3) % 12;
		send();
		return;
	}
	if (code == 38) { // 上
		if(view[2] == 0) {
			if(check(0, -1)) {
				if(door(0, -1)) {
					view[1]--;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}	
				view[1]--;
				send();
			}
			return;
		}
		if(view[2] == 6) {
			if(check(0, 1)) {
				if(door(0, 1)) {
					view[1]++;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[1]++;
				send();
				return;
			}
		}
		if(view[2] == 3) {
			if(check(1, 0)) {
				if(door(1, 0)) {
					view[0]++;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[0]++;
				send();
			}
			return;
		}
		if(view[2] == 9) {
			if(check(-1, 0)) {
				if(door(-1, 0)) {
					view[0]--;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[0]--;
				send();
			}
			return;
		}
		return;
	}
	if (code == 40) { // 下
		if(view[2] == 6) {
			if(check(0, -1)) {
				if(door(0, -1)) {
					view[1]--;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}	
				view[1]--;
				send();
			}
			return;
		}
		if(view[2] == 0) {
			if(check(0, 1)) {
				if(door(0, 1)) {
					view[1]++;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[1]++;
				send();
				return;
			}
		}
		if(view[2] == 9) {
			if(check(1, 0)) {
				if(door(1, 0)) {
					view[0]++;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[0]++;
				send();
			}
			return;
		}
		if(view[2] == 6) {
			if(check(-1, 0)) {
				if(door(-1, 0)) {
					view[0]--;
					ws.send("S:" + "o " + view[0] + " " + view[1]);
					let e = document.getElementById(view[0] + "-" + view[1]);
					e.className = "b0";
				}
				view[0]--;
				send();
			}
			return;
		}
		return;
	}
	if(help == "help") {
		help = "";
		ws.send("S:" + "r");
	}
}

var band = 83;
var group = 0;

window.onload = function() {
	let q = location.search;
	if(q == null) q = "";
	else q = q.substr(1);
	q = q.split("&");
	if(q.length > 0 && q[0] != "") {
		group = parseInt(q[0]);
	}
	ws = "ws";
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
	canvas = document.getElementById('maze');
	ctx = canvas.getContext('2d');
	clear();
	ws = new WebSocket(ws + "://" + host + ":" + port);
	ws.onopen = function() {
		//ws.send("S:" + "c " + size[0] + " " + size[1]); 
		ws.send("band " + band); 
		ws.send("group " + group); 
		ws.send("S:" + "s"); 
		window.addEventListener("keydown", keydown);
	};
	ws.onclose = function() {
		let e = document.getElementById("info2");
		e.innerHTML = "[Close] " + e.innerHTML;
		try {
			window.removeEventListener("keydown");
		} catch(e) {
			// NONE
		}
	};
	ws.onmessage = message;
};

function message(msg) {
	if(msg.data.indexOf("S:") != 0) return;
	let v = msg.data.substr(2).trim().split(" ");
	if(v[0] == "S") {
		size[0] = parseInt(v[1]);
		size[1] = parseInt(v[2]);
		info();
		info3();
		let h = "";
		for(let y=0; y<size[1]; y++) {
			for(let x=0; x<size[0]; x++) {
				h += "<span id=" + x + "-" + y + "></span>";
			}
			h += "</br>";
		}
		let e = document.getElementById("map");
		e.innerHTML = h;
		return;
	}
	if(v[0] == "G") {
		goal[0] = parseInt(v[1]);
		goal[1] = parseInt(v[2]);
		info();
		let e = document.getElementById(goal[0] + "-" + goal[1]);
		e.className = "b3";
		return;
	}
	if(v[0] == "P") {
		if(v[1] == "E")  {
			return;
		}
		if(v[1] == "B")  {
			let es = document.getElementsByClassName("cx");
			for(let i=0; i<es.length; i++) {
				es[i].className = es[i].className.replace("cx", "").trim();
			}
			return;
		}
		let x = parseInt(v[1]);
		let y = parseInt(v[2]);
		if(x != view[0]
		|| y != view[1]) {
			let e = document.getElementById(x + "-" + y);
			if(e.className.indexOf("cx") < 0)
				e.className += " cx";
		}
		return;
	}
	if(v[0] == "Y") {
		view[0] = parseInt(v[1]);
		view[1] = parseInt(v[2]);
		view[2] = parseInt(v[3]);
		info();
		let e;
		if(xy != null) {
			e = document.getElementById(xy);
			e.className = "b0";
		}
		xy = view[0] + "-" + view[1];
		_z = "c" + view[2];
		e = document.getElementById(xy);
		e.className = _z;
		return;
	}
	if(v[0] == "T") {
		let x = parseInt(v[1]);
		let y = parseInt(v[2]);
		let z = parseInt(v[3]);
		let e = null;
		while(v[4] != "") {
			let e = document.getElementById(x + "-" + y);
			e.className = "b" + v[4].charAt(0);
			if(z==0) y--;
			else if(z==3) x++;
			else if(z==6) y++;
			else x--;
			v[4] = v[4].substr(1);
		}
		info();
		if(xy != null) {
			e = document.getElementById(xy);
			e.className = _z;
		}
		return;
	}
	if(v[0] == "M"
	|| v[0] == "R") {
		let y = parseInt(v[1]);
		let x = 0;
		let e = null;
		while(v[2] != "") {
			let c = v[2].charAt(0);
			if(c != '9') {
				e = document.getElementById(x + "-" + y);
				if(e.className == null
				|| e.className == "")
					e.className = ((v[0] == "m")? "b":"z") + c;
			}
			x++;
			v[2] = v[2].substr(1);
		}
		//e = document.getElementById(xy);
		//e.className = _z;
		return;
	}
	if(v[0] == "V") {
		if(v[1] == "E")  {
			return;
		}
		if(v[1] == "B")  {
			clear();
			return;
		}
		let z = [];
		let i = 2;
		while(i < v.length) {
			z.push([parseInt(v[i]), parseInt(v[i+1])]);
			i+=2;
		}
		draw(parseInt(v[1]), z);
		return;
	}
}

function mode(e) {
	let ee = document.getElementById("map");
	if(e.id == "view3") ee = document.getElementById("maze");
	if(e.checked) {
		ee.style.display = "";
	} else {
		ee.style.display = "none";
	}
}
