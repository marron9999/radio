function parrot() {
	let i = {
	};

	i.send = function(wsx, val) {
		for(let j = 0; j < wsx[0].length; j++) {
			wsx[0][j].send(val);
		}
		for(let j = 0; j < wsx[1].length; j++) {
			wsx[1][j].send("PARROT " + val);
		}
	};
	i.close = function() {
	};
	i.open = function() {
	};
	i.message = function (wsx, msg) {
		if(msg.indexOf("S:") != 0) return false;
		let val = msg.substr(2).trim();
		this.send(wsx, "S:" + val + " " + val);
		return true;
	};
	return i;
}

const plugin = function(g) {
	i = parrot();
	return i;
};

module.exports = { plugin };
