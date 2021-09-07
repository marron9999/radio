const log = require('./log.js').log;

const MainPanel = require('./o_MainPanel.js');
const MouseEvent = require('./o_MouseEvent.js');
const Graphics = require('./o_Graphics.js');

function othello(g) {
	let i = {
	};
	g = parseInt(g / 10) + 1;
	if(g > 7) g = 7;
	i.mainPanel = MainPanel.MainPanel(null);
	i.mainPanel.ai.SEARCH_LEVEL = g;
	i.println = function(val) {
		this.send2(val);
	};
	i.send1 = function(val) {
		this.wsx[0][0].send("S:" + val);
		for(let i=0; i<this.wsx[1].length; i++) {
			this.wsx[1][i].send("[OTHELLO] " + "S:" + val);
		}
	};
	i.send2 = function(val) {
		for(let i=0; i<this.wsx[0].length; i++) {
			this.wsx[0][i].send("S:" + val);
		}
		for(let i=0; i<this.wsx[1].length; i++) {
			this.wsx[1][i].send("OTHELLO " + "S:" + val);
		}
	};
	i.close = function() {
	};
	i.open = function() {
	};
	i.message = function(wsx, msg) {
		msg = "" + msg;
		let v = msg.split(" ");
		if(v[0].indexOf("S:") != 0) return;
		this.wsx = wsx;
		v[0] = v[0].substr(2);
		if(v[0] == "pass") {
			this.pass();
			return;
		}
		if(v[0] == "play") {
			this.play(parseInt(v[1]), parseInt(v[2]));
			return;
		}
		if(v[0] == "start") {
			this.result0();
			this.result();
			return;
		}
	};
	i.white = function() {
		this.mainPanel.play_x = -1;
		this.mainPanel.play_y = -1;
		this.mainPanel.inv = false;
		this.mainPanel.pass = false;
		this.mainPanel.stones = [];
		this.mainPanel.ai.compute();
		this.result();
	}
	i.white = i.white.bind(i);

	i.black = function(x, y) {
		let /*MouseEvent*/ e = MouseEvent.MouseEvent();
		e.x = x * this.mainPanel.GS;
		e.y = y * this.mainPanel.GS;
		this.mainPanel.stones = [];
		this.mainPanel.mouseClicked(e);
		this.result();
		if(this.mainPanel.flagForWhite) {
			setTimeout(this.white, 1500);
		}
	}

	// 黒駒を打つ
	i.play = function(x, y) {
		this.mainPanel.ai.compute_x = -1;
		this.mainPanel.ai.compute_y = -1;
		if(this.mainPanel.flagForWhite) {
			this.white();
		} else {
			this.black(x, y);
		}
	}

	//	パスする
	i.pass = function() {
		this.mainPanel.nextTurn();
		this.mainPanel.inv = false;
		this.mainPanel.pass = false;
		this.mainPanel.stones = [];
		this.mainPanel.ai.compute();
		this.result();
	}

	i.result0 = function() {
		let g = Graphics.Graphics();
		g.ps = this;
		this.mainPanel.drawStone(g);
	}
	i.result = function() {
		let g = Graphics.Graphics();
		g.ps = this;
		this.mainPanel.paintComponent(g);
		if(this.mainPanel.pass) {
			this.println("pass");
		}
		if(this.mainPanel.inv) {
			this.println("inv");
		}
		if(this.mainPanel.play_x >= 0) {
			this.println("play "
				+ this.mainPanel.play_x + " "
				+ this.mainPanel.play_y);
		} else {
			this.println("ai "
				+ this.mainPanel.ai.compute_x + " "
				+ this.mainPanel.ai.compute_y);
		}
		let /*Counter*/ counter = this.mainPanel.countStone();
		if(counter.blackCount + counter.whiteCount < 8 * 8) {
			if(this.mainPanel.flagForWhite) {
				this.println("player white");
			} else {
				this.println("player black");
			}
		}
	}
	return i;
}

const plugin = function(g) {
	let i = othello(g);
	return i;
};

module.exports = { plugin };
