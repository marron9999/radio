function group() {
	send("group 11");
}

function start0() {
	if(current >= max) return;
	add("--- start0 ---");
	current++;
	document.getElementById("stat").innerHTML += "<div id=s" + current + ">" + current + ": </div>";
	stat = document.getElementById("s" + current);
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
		add("--- start:timeout ---");
		setTimeout(start, 1000);
	}
	stat.innerHTML += " exist?";
	send("V:exist=" + serial);
	time = new Date().getTime() + 1000;
	setTimeout(scan, 100);
}

