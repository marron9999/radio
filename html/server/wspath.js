function wspath() {
	let q = location.search;
	if(q == null) q = "";
	else q = q.substr(1);
	q = q.split("&");
	if(q.length > 0 && q[0] != "") {
		group = parseInt(q[0]);
	}

	var https = false;
	var ws = "ws";
	var host = window.location.hostname;
	var port = null;
	if(window.location.protcol == "https:") {
		https = true;
		ws = "wss";
	}
	if(host == null
	|| host == "") {
		host = "localhost";
	} else {
		port = window.location.port;
	}
	if(port == null
	|| port == "") {
		if(https) port = "443";
		else port = "80";
	}
	let path = "";
	if(host != "localhost") path = "/radio";
	return ws + "://" + host + ":" + port + path;
}

