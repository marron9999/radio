const log = require('../log.js').log;

function highlow() {
	let i = {
		game: "",
		val: -1,
		test: -1,
		group: -1,
		timer: null
	};

	i.start = function() {
		this.val = parseInt(Math.random() * 10);
		this.test = 0;
		log.info("highlow", "Group " + this.group + ", Result: " + this.val);
	};
	i.move = function() {
		if(this.val >= 0) {
			log.info("highlow", "Group " + i + ", Timeout (10 sec)");
		}
		this.timer = null;
		this.game = "";
		this.val = -1;
		this.test = -1;
		if(this.group == 11) {
			rand11();
		} else {
			rand();
		}
	};

	i.start = i.start.bind(i);
	i.move = i.move.bind(i);

	i.send = function(wsx, val) {
		for(let j = 0; j < wsx[0].length; j++) {
			wsx[0][j].send(val);
		}
		for(let j = 0; j < wsx[1].length; j++) {
			wsx[1][j].send("HIGHLOW " + val);
		}
	};
	i.close = function() {
	};
	i.open = function() {
	};
	i.message = function (wsx, msg) {
		if(msg.indexOf("V:") != 0) return false;
		let val = msg.substr(2).trim().split("=");
		if(this.test < 0) return false;
		if(this.val < 0) return false;
		if(val[0] == "exist") {
			val = "V:" + val[0] + "=" + val[1];
			this.send(wsx, val);
			return false;
		}
		if(val[0] == "game") {
			if(this.game == "") {
				log.info("highlow", ">" + msg);
				this.game = val[1];
				val = "V:" + val[0] + "=" + val[1];
				this.send(wsx, val);
				this.timer = setTimeout(this.move, 10*1000);
			}
			return false;
		}
		if(val[0] == this.game) {
			let v = parseInt(val[1]);
			if(v == this.val) {
				if(this.timer != null)
					clearTimeout(this.timer);
				this.timer = null;

				val = "V:" + val[0] + "=1";
				this.send(wsx, val);
				this.val = -1;
				this.move();
				return false;
			}

			this.test++;
			if(this.test >= 3) {
				if(this.timer != null)
					clearTimeout(this.timer);
				this.timer = null;

				val = "V:" + val[0] + "=-1";
				this.send(wsx, val);
				this.val = -1;
				this.move();
				return true;
			}

			if(v < this.val) {
				val = "V:" + val[0] + "=2";
				this.send(wsx, val);
				return false;
			}
			if(v > this.val) {
				val = "V:" + val[0] + "=0";
				this.send(wsx, val);
				return false;
			}
			return false;
		}
		return false;
	};
	return i;
}

function rand() {
	while(true) {
		let i = parseInt(Math.random() * 10) + 1;
		if(inst[i].test < 0) {
			log.info("highlow", "Group " + i + ",Wait 5 sec");
			inst[i].test = 0;
			setTimeout(inst[i].start, 5 * 1000);
			return;
		}
	}
}
function rand11() {
	log.info("highlow", "Group 11, Wait 5 sec");
	setTimeout(inst[11].start, 5 * 1000);
}

const plugin = function(g) {
	if(g > 11) return inst[0];
	return inst[g];
};

let inst = [];
for(let n=0; n<12; n++) {
	i = highlow();
	i.group = n;
	inst.push(i);
}

rand11();
for(let n=0; n<6; n++) {
	rand();
}

module.exports = { plugin };
