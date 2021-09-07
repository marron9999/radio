const log = require('./log.js').log;

function maze() {
	let i = {

	map1 : [],
	map2 : [],
	xm : 21,
	ym : 21,
	zm : 1,
	xy : [],
	xyi : -1,
	nxi : -1,
	xyc : 0,
	fin : null,
	stp : null,
	stpc: 0,
	stpm: 0,
	tstc: 0,
	xg : -1,
	yg : -1,
	gen: function(mx, my, _fin, _stp) {
		if(_fin == undefined || _fin == null)
			_fin = function() {}; 
		if(_stp == undefined || _stp == null)
			_stp = function() {}; 
		this.xm = mx;
		this.ym = my;
		this.zm = parseInt(Math.min(this.xm/4, this.ym/4));
		this.zm = Math.min(this.zm, 50);
		this.fin = _fin;
		this.stp = _stp;
		this.stpm = Math.max(1, parseInt(this.xm * this.ym / 100));
		this.stpc = this.stpm;
		this.map1 = [];
		this.map2 = [];
		this.xyi = -1;
		this.xyc = 0;
		this.nxi = -1;
		this.nxc = 0;
		this.tstc = 0;
		this.xy = [];
		for(let i=0; i<this.ym; i++) {
			this.map1[i] = [];
			this.map2[i] = [];
			for(let j=0; j<this.xm; j++) {
				this.map1[i][j] = 0;
				this.map2[i][j] = 9;
			}
		}
		for(let i=0; i<this.xm; i++) {
			this.map1[0][i] = 1;
			this.map1[this.ym-1][i] = 1;
			this.map2[0][i] = 1;
			this.map2[this.ym-1][i] = 1;
		}
		for(let i=0; i<this.ym; i++) {
			this.map1[i][0] = 1;
			this.map1[i][this.xm-1] = 1;
			this.map2[i][0] = 1;
			this.map2[i][this.xm-1] = 1;
		}
		for(let i=0; i<this.ym; i+=2) {
			this.check4(0, i);
			this.check4(this.xm-1, i);
		}
		for(let i=0; i<this.xm; i+=2) {
			this.check4(i, 0);
			this.check4(i, this.ym-1);
		}
		this.stp(this.map);
		this.scan();
	},
	check4: function(x, y) {
		let z = parseInt(Math.random() * 4);
		if(z == 1) {
			this.check(x, y, x - 2, y);
			this.check(x, y, x, y + 2);
			this.check(x, y, x + 2, y);
			this.check(x, y, x, y - 2);
			return;
		}
		if(z == 2) {
			this.check(x, y, x, y + 2);
			this.check(x, y, x + 2, y);
			this.check(x, y, x, y - 2);
			this.check(x, y, x - 2, y);
			return;
		}
		if(z == 3) {
			this.check(x, y, x + 2, y);
			this.check(x, y, x, y - 2);
			this.check(x, y, x - 2, y);
			this.check(x, y, x, y + 2);
			return;
		}
		this.check(x, y, x, y - 2);
		this.check(x, y, x - 2, y);
		this.check(x, y, x, y + 2);
		this.check(x, y, x + 2, y);
	},
	check: function(xs, ys, xe, ye) {
		if(xe < 0 || xe >= this.xm) return;
		if(ye < 0 || ye >= this.ym) return;
		if(this.map1[ye][xe] == 0) {
			if(this.xyi >= 0) {
				this.xyc++;
				this.xy[this.xyi] = [xs, ys, xe, ye];
				this.nxi = this.xyi;
				let i = this.xyi;
				while(this.xyi >= 0) {
					this.xyi++;
					if(this.xyi >= this.xy.length) this.xyi = 0;
					if(i == this.xyi) { this.xyi = -1; break; }
					if(this.xy[this.xyi] == null) { break; }
				}
			} else {
				this.xyc++;
				this.nxi = this.xy.length;
				this.xy[this.xy.length] = [xs, ys, xe, ye];
			}
		}
	},
	goal: function() {
		while(true) {
//			let z = parseInt(Math.random() * 7);
//			let xa = parseInt(Math.random() * this.xm / 4);
//			let ya = parseInt(Math.random() * this.ym / 4);
//			let xs = parseInt(this.xm / 4);
//			let ys = parseInt(this.ym / 4);
			let xs = parseInt(Math.random() * this.xm / 4);
			let ys = parseInt(Math.random() * this.ym / 4);
//			xs = xa + (z <= 2)? xs * z: xs * 3;
//			if(z <= 3) ys = ya + ys * 3;
//			else ys = ya + ys * (6 - z);
			xs = (xs & 0x7ffffffe) + 1;
			ys = (ys & 0x7ffffffe) + 1;
//			if(xs >= this.xm) xs = this.xm - 1;
//			if(ys >= this.ym) ys = this.ym - 1;
			if(this.map1[ys][xs] == 0) {
				let b = 0;
				if(this.map1[ys][xs-1] == 1) b++;
				if(this.map1[ys][xs+1] == 1) b++;
				if(this.map1[ys-1][xs] == 1) b++;
				if(this.map1[ys+1][xs] == 1) b++;
				if(b==3) {
					this.yg = ys;
					this.xg = xs;
					this.map1[ys][xs] = 3;
					this.map2[ys][xs] = 3;
					return;
				}
			}
		}
	},
	door: function(m) {
		let dz = [];
		for(let i=0; i<this.ym; i+=2) {
			for(let j=0; j<this.xm; j+=2) {
				let c = -1;
				try {
					if(this.map1[i][j+1] == 0
					|| this.map1[i][j+1] == 5) {
						dz[dz.length] = [j+1, i];
					}
				} catch(e) {}
				try {
					if(this.map1[i][j-1] == 0
					|| this.map1[i][j-1] == 5) {
						dz[dz.length] = [j-1, i];
					}
				} catch(e) {}
				try {
					if(this.map1[i+1][j] == 0
					|| this.map1[i+1][j] == 5) {
						dz[dz.length] = [j, i+1];
					}
				} catch(e) {}
				try {
					if(this.map1[i-1][j] == 0
					|| this.map1[i-1][j] == 5) {
						dz[dz.length] = [j, i-1];
					}
				} catch(e) {}
			}
		}
		while(m>0) {
			let n = parseInt(Math.random() * dz.length);
			if(dz[n] != 0) {
				let xs = dz[n][0];
				let ys = dz[n][1];
				dz[n] = 0;
				this.map1[ys][xs] = 2;
				m--;
			}
		}
	},
	scan: function () {
		while(this.xyc > 0) {
			this.scan_step();
		}
		this.stp(this.map);
		this.goal();
		let m = parseInt( this.xm * this.ym / 4 / 10);
		this.door(m);
		this.xy = null;
		this.fin(this.map);
	},
	scan_step: function () {
		let i = this.nxi;
		this.nxc++;
		if(i < 0 || this.nxc >= this.zm) {
			i = parseInt(Math.random() * this.xy.length);
			this.nxc = 0;
		}
		while(this.xy[i] == null) {
			i++;
			if(i >= this.xy.length) i = 0;
		}
		let xs = this.xy[i][0];
		let ys = this.xy[i][1];
		let xe = this.xy[i][2];
		let ye = this.xy[i][3];
		this.xyc--;
		this.xy[i] = null;
		if(this.xyi < 0) this.xyi = i;
		this.nxi = -1;
		if(this.map1[ye][xe] != 0) {
			return;
		}
		this.map1[ye][xe] = 1;
		if(xs == xe) {
			if(ys < ye) {
				this.map1[ys + 1][xs] = 1;
			} else {
				this.map1[ys - 1][xs] = 1;
			}
		} else {
			if(xs < xe) {
				this.map1[ys][xs + 1] = 1;
			} else {
				this.map1[ys][xs - 1] = 1;
			}
		}
		this.check4(xe, ye);
		this.stpc--;
		if(this.stpc <= 0) {
			this.stpc = this.stpm;
			this.stp(this.map);
		}
	},
	test: function (xc, yc, zc) {
		let t = [];
		let v1 = "";
		let v2 = "";
		let v3 = "";
		let c = 0;
		if(zc == 3 || zc == -1) {
			for(let x = xc; x < this.map1[yc].length; x++) {
				v1 += this.map1[yc    ][x];
				v2 += this.map1[yc - 1][x];
				v3 += this.map1[yc + 1][x];
				this.map2[yc    ][x] = this.map1[yc    ][x];
				this.map2[yc - 1][x] = this.map1[yc - 1][x];
				this.map2[yc + 1][x] = this.map1[yc + 1][x];
				if(this.map1[yc][x] != 3)
					if(this.map1[yc][x] != 0) break;
				c++;
				if(c >= 10) break;
			}
			t.push(xc + " " + yc + " 3 " + v1);
			t.push(xc + " " + (yc - 1) + " 3 " + v2);
			t.push(xc + " " + (yc + 1) + " 3 " + v3);
		}
		if(zc == 9 || zc == -1) {
			v1 = "";
			v2 = "";
			v3 = "";
			c = 0;
			for(let x = xc; x >= 0; x--) {
				v1 += this.map1[yc    ][x];
				v2 += this.map1[yc - 1][x];
				v3 += this.map1[yc + 1][x];
				this.map2[yc    ][x] = this.map1[yc    ][x];
				this.map2[yc - 1][x] = this.map1[yc - 1][x];
				this.map2[yc + 1][x] = this.map1[yc + 1][x];
				if(this.map1[yc][x] != 3)
					if(this.map1[yc][x] != 0) break;
				c++;
				if(c >= 10) break;
			}
			t.push(xc + " " + yc + " 9 " + v1);
			t.push(xc + " " + (yc - 1) + " 9 " + v2);
			t.push(xc + " " + (yc + 1) + " 9 " + v3);
		}
		if(zc == 6 || zc == -1) {
			v1 = "";
			v2 = "";
			v3 = "";
			c = 0;
			for(let y = yc; y < this.map1.length; y++) {
				v1 += this.map1[y][xc    ];
				v2 += this.map1[y][xc - 1];
				v3 += this.map1[y][xc + 1];
				this.map2[y][xc    ] = this.map1[y][xc    ];
				this.map2[y][xc - 1] = this.map1[y][xc - 1];
				this.map2[y][xc + 1] = this.map1[y][xc + 1];
				if(this.map1[y][xc] != 3)
					if(this.map1[y][xc] != 0) break;
				c++;
				if(c >= 10) break;
			}
			t.push(xc + " " + yc + " 6 " + v1);
			t.push((xc - 1) + " " + yc + " 6 " + v2);
			t.push((xc + 1) + " " + yc + " 6 " + v3);
		}
		if(zc == 0 || zc == -1) {
			v1 = "";
			v2 = "";
			v3 = "";
			c = 0;
			for(let y = yc; y >= 0; y--) {
				v1 += this.map1[y][xc    ];
				v2 += this.map1[y][xc - 1];
				v3 += this.map1[y][xc + 1];
				this.map2[y][xc    ] = this.map1[y][xc    ];
				this.map2[y][xc - 1] = this.map1[y][xc - 1];
				this.map2[y][xc + 1] = this.map1[y][xc + 1];
				if(this.map1[y][xc] != 3)
					if(this.map1[y][xc] != 0) break;
				c++;
				if(c >= 10) break;
			}
			t.push(xc + " " + yc + " 0 " + v1);
			t.push((xc - 1) + " " + yc + " 0 " + v2);
			t.push((xc + 1) + " " + yc + " 0 " + v3);
		}
		return t;
	},
	gw : 14,
	gh : 7,
	draw: function(x, y, z) {
		let vx=0, vy = 1	// 向き:6
		if(z == 0) { vy = -1; }
		else if(z == 3) { vx = 1; vy = 0; }
		else if(z == 9) { vx = -1; vy = 0; }
		let ctx = [];
		let ctr = [];
		let ctl = [];
		for (let pr=0; pr<10; pr++ ) {
			// pr		// 距離
			// f, l, r	// 前方、左方、右方の状況
			let sx = x + vx * pr;
			let sy = y + vy * pr;
			let f = this.map1[sy     ][sx     ]; // 前方の状況を調べます
			let l = this.map1[sy - vx][sx + vy]; // 左方の状況
			let r = this.map1[sy + vx][sx - vy]; // 右方の状況
			if(f >= 4) f = 0;
			if(l >= 4) l = 0;
			if(r >= 4) r = 0;
			if ( f > 0 ) { // もし通路でない場合
				ctx.push(this.front(f, pr)); // frontメソッドを実行します
				break;
			}
			ctl.push(this.left(l, pr)); // leftメソッドを実行します
			ctr.push(this.right(r, pr)); // rightメソッドを実行します
		}
		for(let i=ctl.length - 1; i >= 0; i--) ctx.push(ctl[i]);
		for(let i=ctr.length - 1; i >= 0; i--) ctx.push(ctr[i]);
		return ctx;
	},
	front: function(f, pr) { // 正面に壁がある場合のメソッド
		var gx = [];
		var gy = [];
		gx[0] =                pr * this.gw;	gy[0] =                pr * this.gh;
		gx[1] = this.gw * 20 - pr * this.gw;	gy[1] = gy[0];
		gx[2] = gx[1];							gy[2] = this.gh * 20 - pr * this.gh;
		gx[3] = gx[0];							gy[3] = gy[2];
		return this.polygon(f, gx, gy);
	},
	left: function(l, pr) { // 左側に壁がある場合のメソッド
		var gx = [];
		var gy = [];
		if ( l > 0 ) {
			gx[0] = this.gw + pr * this.gw;		gy[0] = this.gh      + pr * this.gh;
			gx[1] =           pr * this.gw;		gy[1] =                pr * this.gh;
			gx[2] = gx[1];						gy[2] = this.gh * 20 - pr * this.gh;
			gx[3] = gx[0];						gy[3] = this.gh * 19 - pr * this.gh;
		} else {
			gx[0] =           pr * this.gw;		gy[0] = this.gh      + pr * this.gh;
			gx[1] = this.gw + pr * this.gw;		gy[1] = gy[0];
			gx[2] = gx[1];						gy[2] = this.gh * 19 - pr * this.gh;
			gx[3] = gx[0];						gy[3] = gy[2];
		}
		return this.polygon(l, gx, gy);
	},
	right: function(r, pr) { // 右側に壁がある場合のメソッド / 内容はleftとほとんど同じ
		var gx = [];
		var gy = [];
		if ( r > 0 ) {
			gx[0] = this.gw * 20 - pr * this.gw;	gy[0] =                pr * this.gh;
			gx[1] = this.gw * 19 - pr * this.gw;	gy[1] = this.gh      + pr * this.gh;
			gx[2] = gx[1];							gy[2] = this.gh * 19 - pr * this.gh;
			gx[3] = gx[0];							gy[3] = this.gh * 20 - pr * this.gh;
		} else {
			gx[0] = this.gw * 19 - pr*this.gw;	gy[0] = this.gh      + pr * this.gh;
			gx[1] = this.gw * 20 - pr*this.gw;	gy[1] = gy[0];
			gx[2] = gx[1];						gy[2] = this.gh * 19 - pr * this.gh;
			gx[3] = gx[0];						gy[3] = gy[2];
		}
		return this.polygon(r, gx, gy);
	},
	polygon: function(v, gx, gy) {
		let h = "" + v;
		for(let i=0; i<gx.length; i++) {
			h += ' ' + gx[i] + ' ' + gy[i];
		}
		return h;
	}
	};

	i.send1 = function(wsx, val) {
		wsx[0][0].send(val);
		for(let i=0; i<wsx[1].length; i++) {
			wsx[1][i].send("[MAZE] " + val);
		}
	};
	i.send2 = function(wsx, val) {
		for(let i=0; i<wsx[0].length; i++) {
			wsx[0][i].send(val);
		}
		for(let i=0; i<wsx[1].length; i++) {
			wsx[1][i].send("MAZE " + val);
		}
	};
	i.close = function() {
	};
	i.open = function() {
	};
	i.message = function (wsx, msg) {
		//log.info(">" + msg);
		if(msg.indexOf("S:") != 0) return false;
		let val = msg.substr(2).trim().split(" ");
		if(val[0] == "s") {
			let x = this.xm - 2;
			let y = this.ym - 2;
			let z = 0;
			if(this.map1[y-1][x] == 1) z = 9;
			wsx[0][0].maze = [x, y, z];
			this.send1(wsx, "S:" + "S " + this.xm + " " + this.ym);
			for(let y=0; y<this.ym; y++) {
				let m = "";
				for(let x=0; x<this.xm; x++) {
					m += this.map2[y][x];
				}
				this.send1(wsx, "S:" + "M " + y + " " + m);
			}
			this.send1(wsx, "S:" + "G " + this.xg + " " + this.yg);
			let ctx = this.test(x, y, z);
			for(let i=0; i<ctx.length; i++) {
				this.send1(wsx, "S:" + "T " + ctx[i]);
			}
			this.send1(wsx, "S:" + "Y " + x + " " + y + " " + z);
			this.send2(wsx, "S:" + "P B");
			for(let i = 0; i < wsx[0].length; i++) {
				if(wsx[0][i].maze != undefined) {
					val = "S:" + "P "
						+ wsx[0][i].maze[0] + " "
						+ wsx[0][i].maze[1] + " "
						+ wsx[0][i].maze[2];
					this.send2(wsx, val);
				}
			}
			this.send2(wsx, "S:" + "P E");
			this.send1(wsx, "S:" + "V B");
			ctx = this.draw(x, y, z);
			for(let i=0; i<ctx.length; i++) {
				this.send1(wsx, "S:" + "V " + ctx[i]);
			}
			this.send1(wsx, "S:" + "V E");
			return true;
		}
		if(val[0] == "o") {
			let x = parseInt(val[1]);
			let y = parseInt(val[2]);
			if(this.map1[y][x] == 2) {
				this.map1[y][x] = 0;
				this.map2[y][x] = 0;
			}
			return true;
		}
		if(val[0] == "v") {
			let x = parseInt(val[1]);
			let y = parseInt(val[2]);
			let z = parseInt(val[3]);
			wsx[0][0].maze = [x, y, z];
			let ctx = this.test(x, y, z);
			for(let i=0; i<ctx.length; i++) {
				this.send2(wsx, "S:" + "T " + ctx[i]);
			}
			this.send1(wsx, "S:" + "Y " + x + " " + y + " " + z);
			this.send2(wsx, "S:" + "P B");
			for(let i = 0; i < wsx[0].length; i++) {
				if(wsx[0][i].maze != undefined) {
					val = "S:" + "p "
						+ wsx[0][i].maze[0] + " "
						+ wsx[0][i].maze[1] + " "
						+ wsx[0][i].maze[2];
					this.send2(wsx, val);
				}
			}
			this.send2(wsx, "S:" + "P E");
			ctx = this.draw(x, y, z);
			this.send1(wsx, "S:" + "V B");
			for(let i=0; i<ctx.length; i++) {
				this.send1(wsx, "S:" + "V " + ctx[i]);
			}
			this.send1(wsx, "S:" + "V E");
			return true;
		}
		if(val[0] == "m") {
			for(let y=0; y<this.ym; y++) {
				let m = "";
				for(let x=0; x<this.xm; x++) {
					m += this.map2[y][x];
				}
				this.send1(wsx, "S:" + "M " + y + " " + m);
			}
			return true;
		}
		if(val[0] == "r") {
			for(let y=0; y<this.ym; y++) {
				let m = "";
				for(let x=0; x<this.xm; x++) {
					m += this.map1[y][x];
				}
				this.send1(wsx, "S:" + "R " + y + " " + m);
			}
			return true;
		}
		return false;
	};

	return i;
}

const plugin = function(g) {
	let i = maze();
	if(g > 40) g = 40;
	let gg = 10 + g;
	i.gen(gg * 2 + 1, gg * 2 + 1);
	return i;
};

module.exports = { plugin };
