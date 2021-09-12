const MainPanel = require('./o_MainPanel.js');
const Undo = require('./o_Undo.js');

/*
 * Created on 2004/12/22
 *
 */

/**
 * オセロのAI。
 * 
 * @author mori
 * 
 */
const AI = function(/*MainPanel*/ panel) {
	let ai = _AI_();
	/**
	 * コンストラクタ。メインパネルへの参照を保存。
	 * 
	 * @param panel
	 *            メインパネルへの参照。
	 */
	ai.panel = panel;
	return ai;
}

const MAX_VALUE = Number.MAX_SAFE_INTEGER;
const MIN_VALUE = Number.MIN_SAFE_INTEGER;

// 盤面の各場所の価値
const valueOfPlace = [
		[ 120, -20, 20, 5, 5, 20, -20, 120 ],
		[ -20, -40, -5, -5, -5, -5, -40, -20 ],
		[ 20, -5, 15, 3, 3, 15, -5, 20 ],
		[ 5, -5, 3, 3, 3, 3, -5, 5 ],
		[ 5, -5, 3, 3, 3, 3, -5, 5 ],
		[ 20, -5, 15, 3, 3, 15, -5, 20 ],
		[ -20, -40, -5, -5, -5, -5, -40, -20 ],
		[ 120, -20, 20, 5, 5, 20, -20, 120 ] ];

const _AI_ = function() {
	return {

	// メインパネルへの参照
	/*MainPanel*/ panel: null,

	// 深読みするレベル（大きい値だとものすごい時間がかかってしまうので注意）
	SEARCH_LEVEL : 7,

	compute_x : -1,
	compute_y : -1,
	
	/**
	 * コンピュータの手を決定する。
	 * 
	 */
	compute : function() {
		// α-β法で石を打つ場所を決める
		// 戻ってくる値は bestX+bestY*MASU
		let temp = this.alphaBeta(true, this.SEARCH_LEVEL, MIN_VALUE, MAX_VALUE);

		// 場所を求める
		let x = temp % this.panel.MASU;
		let y = parseInt(temp / this.panel.MASU);
		//console.log(x + "," + y);

		this.compute_x = x;
		this.compute_y = y;
		
		// 打った場所、ひっくり返した石の位置を記録
		let /*Undo*/ undo = Undo.Undo(x, y);
		// その場所に実際に石を打つ
		this.panel.putDownStone(x, y, false);
		// 実際にひっくり返す
		this.panel.reverse(undo, false);
		// 終了したか調べる
		if (this.panel.endGame())
			return;
		// 手番を変える
		this.panel.nextTurn();
		// プレイヤーがパスの場合はもう一回
		if (this.panel.countCanPutDownStone() == 0) {
//			System.out.println("Player PASS!");
			this.panel.nextTurn();
			this.compute();
		}
	},

	/**
	 * Min-Max法。最善手を探索する。打つ場所を探すだけで実際には打たない。
	 * 
	 * @param flag
	 *            AIの手番のときtrue、プレイヤーの手番のときfalse。
	 * @param level
	 *            先読みの手数。
	 * @return 子ノードでは盤面の評価値。ルートノードでは最大評価値を持つ場所（bestX + bestY * MAS）。
	 */
	minMax : function(flag, level) {
		// ノードの評価値
		let value;
		// 子ノードから伝播してきた評価値
		let childValue;
		// Min-Max法で求めた最大の評価値を持つ場所
		let bestX = 0;
		let bestY = 0;

		// ゲーム木の末端では盤面評価
		// その他のノードはMIN or MAXで伝播する
		if (level == 0) {
			return this.valueBoard();
		}

		if (flag) {
			// AIの手番では最大の評価値を見つけたいので最初に最小値をセットしておく
			value = MIN_VALUE;
		} else {
			// プレイヤーの手番では最小の評価値を見つけたいので最初に最大値をセットしておく
			value = MAX_VALUE;
		}

		// もしパスの場合はそのまま盤面評価値を返す
		if (this.panel.countCanPutDownStone() == 0) {
			return this.valueBoard();
		}

		// 打てるところはすべて試す（試すだけで実際には打たない）
		for (let y = 0; y < this.panel.MASU; y++) {
			for (let x = 0; x < this.panel.MASU; x++) {
				if (this.panel.canPutDown(x, y)) {
					let /*Undo*/ undo = Undo.Undo(x, y);
					// 試しに打ってみる（盤面描画はしないのでtrue指定）
					this.panel.putDownStone(x, y, true);
					// ひっくり返す（盤面描画はしないのでtrue指定）
					this.panel.reverse(undo, true);
					// 手番を変える
					this.panel.nextTurn();
					// 子ノードの評価値を計算（再帰）
					// 今度は相手の番なのでflagが逆転する
					childValue = this.minMax(!flag, level - 1);
					// 子ノードとこのノードの評価値を比較する
					if (flag) {
						// AIのノードなら子ノードの中で最大の評価値を選ぶ
						if (childValue > value) {
							value = childValue;
							bestX = x;
							bestY = y;
						}
					} else {
						// プレイヤーのノードなら子ノードの中で最小の評価値を選ぶ
						if (childValue < value) {
							value = childValue;
							bestX = x;
							bestY = y;
						}
					}
					// 打つ前に戻す
					this.panel.undoBoard(undo);
				}
			}
		}

		if (level == this.SEARCH_LEVEL) {
			// ルートノードなら最大評価値を持つ場所を返す
			return bestX + bestY * this.panel.MASU;
		} else {
			// 子ノードならノードの評価値を返す
			return value;
		}
	},

	/**
	 * α-β法。最善手を探索する。打つ場所を探すだけで実際には打たない。
	 * 
	 * @param flag
	 *            AIの手番のときtrue、プレイヤーの手番のときfalse。
	 * @param level
	 *            先読みの手数。
	 * @param alpha
	 *            α値。このノードの評価値は必ずα値以上となる。
	 * @param beta
	 *            β値。このノードの評価値は必ずβ値以下となる。
	 * @return 子ノードでは盤面の評価値。ルートノードでは最大評価値を持つ場所（bestX + bestY * MAS）。
	 */
	alphaBeta : function(flag, level, alpha, beta) {
		//console.log("alphaBeta()");
		// ノードの評価値
		let value;
		// 子ノードから伝播してきた評価値
		let childValue;
		// Min-Max法で求めた最大の評価値を持つ場所
		let bestX = 0;
		let bestY = 0;

		// ゲーム木の末端では盤面評価
		// その他のノードはMIN or MAXで伝播する
		if (level == 0) {
			//console.log("level == 0 -> valueBoard()");
			return this.valueBoard();
		}

		if (flag) {
			// AIの手番では最大の評価値を見つけたいので最初に最小値をセットしておく
			value = MIN_VALUE;
		} else {
			// プレイヤーの手番では最小の評価値を見つけたいので最初に最大値をセットしておく
			value = MAX_VALUE;
		}

		// もしパスの場合はそのまま盤面評価値を返す
		if (this.panel.countCanPutDownStone() == 0) {
			//console.log("countCanPutDownStone() == 0 -> valueBoard()");
			return this.valueBoard();
		}

		// 打てるところはすべて試す（試すだけで実際には打たない）
		//console.log("MASU:" + this.panel.MASU);
		for (let y = 0; y < this.panel.MASU; y++) {
			for (let x = 0; x < this.panel.MASU; x++) {
				if (this.panel.canPutDown(x, y)) {
					//console.log("canPutDown(" + x + "," + y + "), flag:" + flag);
					let /*Undo*/ undo = Undo.Undo(x, y);
					// 試しに打ってみる（盤面描画はしないのでtrue指定）
					this.panel.putDownStone(x, y, true);
					// ひっくり返す（盤面描画はしないのでtrue指定）
					this.panel.reverse(undo, true);
					// 手番を変える
					this.panel.nextTurn();
					// 子ノードの評価値を計算（再帰）
					// 今度は相手の番なのでflagが逆転する
					childValue = this.alphaBeta(!flag, level - 1, alpha, beta);
					// 子ノードとこのノードの評価値を比較する
					if (flag) {
						// AIのノードなら子ノードの中で最大の評価値を選ぶ
						if (childValue > value) {
							value = childValue;
							// α値を更新
							alpha = value;
							bestX = x;
							bestY = y;
						}
						// このノードの現在のvalueが受け継いだβ値より大きかったら
						// この枝が選ばれることはないのでこれ以上評価しない
						// = forループをぬける
						if (value > beta) { // βカット
							// System.out.println("βカット");
							// 打つ前に戻す
							this.panel.undoBoard(undo);
							return value;
						}
					} else {
						// プレイヤーのノードなら子ノードの中で最小の評価値を選ぶ
						if (childValue < value) {
							value = childValue;
							// β値を更新
							beta = value;
							bestX = x;
							bestY = y;
						}
						// このノードのvalueが親から受け継いだα値より小さかったら
						// この枝が選ばれることはないのでこれ以上評価しない
						// = forループをぬける
						if (value < alpha) { // αカット
							// System.out.println("αカット");
							// 打つ前に戻す
							this.panel.undoBoard(undo);
							return value;
						}
					}
					// 打つ前に戻す
					this.panel.undoBoard(undo);
				}
			}
		}

		//console.log("level=" + level + ", value=" + value);
		//console.log("best=" + bestX + "," + bestY);
		if (level == this.SEARCH_LEVEL) {
			// ルートノードなら最大評価値を持つ場所を返す
			return bestX + bestY * this.panel.MASU;
		} else {
			// 子ノードならノードの評価値を返す
			return value;
		}
	},

	/**
	 * 評価関数。盤面を評価して評価値を返す。盤面の場所の価値を元にする。
	 * 
	 * @return 盤面の評価値。
	 */
	valueBoard : function() {
		let value = 0;

		for (let y = 0; y < this.panel.MASU; y++) {
			for (let x = 0; x < this.panel.MASU; x++) {
				// 置かれた石とその場所の価値をかけて足していく
				value += this.panel.getBoard(x, y) * valueOfPlace[y][x];
			}
		}

		// 白石（AI）が有利なときは負になるので符合を反転する
		return -value;
	}

	};
}


module.exports = { AI };
