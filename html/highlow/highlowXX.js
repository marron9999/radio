function sendGroup() {
	//send("group 0");
}

let gg = -1;
function start0() {
	if(current >= max) return;
	add("--- start0 ---");
	let g = gg;
	while(gg == g) {
		g = parseInt(Math.random() * 10) + 1;
	}
	send("group " + g);

	current++;
	if(stat != null) {
		if(stat.id == "s" + current) {
			stat.innerHTML = current + ":" + g + ": ";
		} else {
			stat = null;
		}
	}
	if(stat == null) {
		document.getElementById("stat").innerHTML += "<div id=s" + current + ">" + current + ":" + g + ": </div>";
		stat = document.getElementById("s" + current);
	}
	start();
}
function start() {
	add("--- start ---");
	test = function(d) {
		d = d.split("=");
		if(d[0] == "V:exist"
		&& d[1] == "" + serial) {
			game();
			return true;
		}
		return false;
	}
	over = function(d) {
		current--;
		add("--- start:timeout ---");
		setTimeout(start0, 1000);
	}
	stat.innerHTML += " exist?";
	send("V:exist=" + serial);
	time = new Date().getTime() + 1000;
	setTimeout(scan, 100);
}
