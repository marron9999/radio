function select(e) {
	const list = {
		scratch:"scratch/",
		radio:"radio.html",
		othello:"othello.html",
		maze:"maze.html",
		startrek:"startrek.html",
	};
	let t = e.innerHTML.toLowerCase();
	for(let id in list) {
		if(t.indexOf(id) >= 0){
			window.open(list[id], id);
			return;
		}
	}
}
function cdmm() {
	window.open("https://coderdojo-mn.com/", "coderdojo");
}
function cdjp() {
	window.open("https://coderdojo.jp/", "coderdojo");
}
function sakura() {
	window.open("https://www.sakura.ad.jp/", "sakura");
}
