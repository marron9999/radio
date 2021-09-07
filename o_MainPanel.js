const InfoPanel = require('./o_InfoPanel.js');
const Counter = require('./o_Counter.js');
const Undo = require('./o_Undo.js');
const Point = require('./o_Point.js');
const AI = require('./o_AI.js');

/*
 * 作成日: 2004/12/17
 *
 */
//import java.awt.*;
//import java.awt.event.*;
//import java.applet.*;
//import javax.swing.*;
/**
 * オセロ盤のクラス。
 * 
 * @author mori
 * 
 */

// マスのサイズ（GRID SIZE）
const GS = 32;
// マスの数。オセロは8×8マス（AIクラスで使うのでpublic）
const MASU = 8;
// 盤面の大きさ＝メインパネルの大きさと同じ
const WIDTH = GS * MASU;
const HEIGHT = WIDTH;
// 空白
const BLANK = 0;
// 黒石
const BLACK_STONE = 1;
// 白石
const WHITE_STONE = -1;
// 小休止の時間
const SLEEP_TIME = 500;
// 終了時の石の数（オセロは8x8-4=60手で終了する）
const END_NUMBER = 60;
// ゲーム状態
const START = 0;
const PLAY = 1;
const YOU_WIN = 2;
const YOU_LOSE = 3;
const DRAW = 4;

const MainPanel = function(/*InfoPanel*/ infoPanel) {
	let mainPanel = _MainPanel_();
//		// Othelloでpack()するときに必要
//		setPreferredSize(new Dimension(WIDTH, HEIGHT));
	mainPanel.infoPanel = infoPanel;

		// 盤面を初期化する
	mainPanel.initBoard();
//		// サウンドをロードする
//		kachi = Applet.newAudioClip(getClass().getResource("kachi.wav"));
		// AIを作成
	mainPanel.ai = AI.AI(mainPanel);
//		// マウス操作を受け付けるようにする
//		addMouseListener(this);
		// START状態（タイトル表示）
//		gameState = START;
	mainPanel.gameState = PLAY;
	return mainPanel;
}

const _MainPanel_ = function() {
	let mainPanel = {

	// 盤面
	board : null,
	// 白の番か
	flagForWhite : false,
	// 打たれた石の数
	putNumber : 0,
//	// 石を打つ音
//	private AudioClip kachi;
	// ゲーム状態
	gameState : 0,
	// AI
	/*AI*/ ai : null,

	// 情報パネルへの参照
	/*InfoPanel*/ infoPanel : null,

	stones : [],

	paintComponent : function(/*Graphics*/ g) {
//		super.paintComponent(g);

		// 盤面を描く
		this.drawBoard(g);

		for(let i=0; i<this.stones.length; i++) {
			let x = this.stones[i][0];
			let y = this.stones[i][1];
			if(this.board[y][x] == BLACK_STONE)
				g.ps.println("stone " + x + " " + y + " *");
			else if(this.board[y][x] == WHITE_STONE)
				g.ps.println("stone " + x + " " + y + " #");
		}

		// 盤面の石の数を数える
		let /*Counter*/ counter = this.countStone();
		g.ps.println("black " + counter.blackCount);
		g.ps.println("white " + counter.whiteCount);
		if (this.gameState == START) {
//			drawTextCentering(g, "OTHELLO");
		}
		else
		if (this.gameState == PLAY) {
			// 石を描く
			//this.drawStone(g);
//			// 盤面の石の数を数える
//			//Counter counter = countStone();
			// ラベルに表示
//			infoPanel.setBlackLabel(counter.blackCount);
//			infoPanel.setWhiteLabel(counter.whiteCount);
//			g.ps.println("\"black\" : " + counter.blackCount + ",");
//			g.ps.println("\"white\" : " + counter.whiteCount + ",");
		}
		else
		if (this.gameState == YOU_WIN) {
			//this.drawStone(g);
//			drawTextCentering(g, "YOU WIN");
			g.ps.println("you WIN");
		}
		else
		if (this.gameState == YOU_LOSE) {
			//this.drawStone(g);
//			drawTextCentering(g, "YOU LOSE");
			g.ps.println("you LOSE");
		}
		else
		if (this.gameState == DRAW) {
			//this.drawStone(g);
//			drawTextCentering(g, "DRAW");
			g.ps.println("you DRAW");
		}

	},

	inv : false,
	pass : false,
	play_x: -1,
	play_y: -1,

	/**
	 * マウスをクリックしたとき。石を打つ。
	 */
	mouseClicked : function(/*MouseEvent*/ e) {
		this.inv = false;
		this.pass = false;
		if (this.gameState == START) {
			// START画面でクリックされたらゲーム開始
			this.gameState = PLAY;
		}
		else
		if (this.gameState == PLAY) {
			// どこのマスかを調べる
			let x = e.getX() / GS;
			let y = e.getY() / GS;
			this.play_x = x;
			this.play_y = y;

			// (x, y)に石が打てる場合だけ打つ
			if (this.canPutDown(x, y)) {
				// 戻せるように記録しておく
				let /*Undo*/ undo = Undo.Undo(x, y);
				// その場所に石を打つ
				this.putDownStone(x, y, false);
				// ひっくり返す
				this.reverse(undo, false);
				// 終了したか調べる
				this.endGame();
				// 手番を変える
				this.nextTurn();
				// AIがパスの場合はもう一回
				if (this.countCanPutDownStone() == 0) {
//					System.out.println("AI PASS!");
					this.pass = true;
					this.nextTurn();
					return;
				} else {
//					// パスでなかったらAIが石を打つ
//					ai.compute();
				}
			} else {
				this.inv = true;
			}
		}
		else
		if (this.gameState == YOU_WIN
		||  this.gameState == YOU_LOSE
		||  this.gameState == DRAW
		) {
//			// ゲーム終了時にクリックされたらスターとへ戻る
//			gameState = START;
//			// 盤面初期化
//			initBoard();
//			break;
		}

//		// 再描画する
//		repaint();
	},

	/**
	 * 盤面を初期化する。
	 * 
	 */
	initBoard : function() {
		for (let y = 0; y < MASU; y++) {
			for (let x = 0; x < MASU; x++) {
				this.board[y][x] = BLANK;
			}
		}
		// 初期配置
		this.board[3][3] = this.board[4][4] = WHITE_STONE;
		this.board[3][4] = this.board[4][3] = BLACK_STONE;

		// 黒番から始める
		this.flagForWhite = false;
		this.putNumber = 0;

		this.gameState = PLAY;
	},

	/**
	 * 盤面を描く。
	 * 
	 * @param g
	 *            描画オブジェクト。
	 */
	drawBoard : function(/*Graphics*/ g) {
//		// マスを塗りつぶす
//		g.setColor(new Color(0, 128, 128));
//		g.fillRect(0, 0, WIDTH, HEIGHT);
//		for (int y = 0; y < MASU; y++) {
//			for (int x = 0; x < MASU; x++) {
//				// マス枠を描画する
//				g.setColor(Color.BLACK);
//				g.drawRect(x * GS, y * GS, GS, GS);
//			}
//		}
	},

	/**
	 * 石を描く。
	 * 
	 * @param g
	 *            描画オブジェクト
	 */
	drawStone(/*Graphics*/ g) {
//		for (int y = 0; y < MASU; y++) {
//			for (int x = 0; x < MASU; x++) {
//				if (board[y][x] == BLANK) {
//					continue;
//				} else if (board[y][x] == BLACK_STONE) {
//					g.setColor(Color.BLACK);
//				} else {
//					g.setColor(Color.WHITE);
//				}
//				g.fillOval(x * GS + 3, y * GS + 3, GS - 6, GS - 6);
//			}
//		}
		for (let y = 0; y < MASU; y++) {
			let line = "";
			for (let x = 0; x < MASU; x++) {
				if (this.board[y][x] == BLANK) {
					line += ".";
					continue;
				}
				if (this.board[y][x] == BLACK_STONE) {
					line += "*";
					continue;
				}
				{
					line += "#";
				}
			}
			g.ps.println("board " + y + " " + line);
		}
	},

	/**
	 * 盤面に石を打つ。
	 * 
	 * @param x
	 *            石を打つ場所のx座標。
	 * @param y
	 *            石を打つ場所のy座標。
	 * @param tryAndError
	 *            コンピュータの思考実験中かどうか。思考中は石を描画しない。
	 */
	putDownStone : function(x, y, tryAndError) {
		let stone;

		// どっちの手番か調べて石の色を決める
		if (this.flagForWhite) {
			stone = WHITE_STONE;
		} else {
			stone = BLACK_STONE;
		}
		// 石を打つ
		this.board[y][x] = stone;
		// コンピュータの思考中でなければ実際に打って再描画する
		if (!tryAndError) {
			this.stones.push([x,y]);
			this.putNumber++;
//			// カチッ
//			kachi.play();
//			// 盤面が更新されたので再描画
//			update(getGraphics());
//			// 小休止を入れる（入れないとすぐにひっくり返しが始まってしまう）
//			sleep();
		}
	},

	/**
	 * 石が打てるかどうか調べる。
	 * 
	 * @param x
	 *            石を打とうとしている場所のx座標。
	 * @param y
	 *            石を打とうとしている場所のy座標。
	 * @return 石が打てるならtrue、打てないならfalseを返す。
	 * 
	 */
	canPutDown : function(x, y) {
		// (x,y)が盤面の外だったら打てない
		if (x >= MASU || y >= MASU)
			return false;
		// (x,y)にすでに石が打たれてたら打てない
		if (this.board[y][x] != BLANK)
			return false;
		// 8方向のうち一箇所でもひっくり返せればこの場所に打てる
		// ひっくり返せるかどうかはもう1つのcanPutDownで調べる
		if (this.canPutDown_(x, y, 1, 0)) {
			//console.log("canPutDown(" + x + "," + y + ")");
			return true; // 右
		}
		if (this.canPutDown_(x, y, 0, 1)) {
			//console.log("canPutDown(" + x + "," + y + ")");
			return true; // 下
		}
		if (this.canPutDown_(x, y, -1, 0)) {
			//console.log("canPutDown(" + x + "," + y + ")");
			return true; // 左
		}
		if (this.canPutDown_(x, y, 0, -1)) {
			//console.log("canPutDown(" + x + "," + y + ")");
			return true; // 上
		}
		if (this.canPutDown_(x, y, 1, 1)) {
			//console.log("canPutDown(" + x + "," + y + ")");
			return true; // 右下
		}
		if (this.canPutDown_(x, y, -1, -1)) {
			//console.log("canPutDown(" + x + "," + y + ")");
			return true; // 左上
		}
		if (this.canPutDown_(x, y, 1, -1)) {
			//console.log("canPutDown(" + x + "," + y + ")");
			return true; // 右上
		}
		if (this.canPutDown_(x, y, -1, 1)) {
			//console.log("canPutDown(" + x + "," + y + ")");
			return true; // 左下
		}

		// どの方向もだめな場合はここには打てない
		return false;
	},

	/**
	 * vecX、vecYの方向にひっくり返せる石があるか調べる。
	 * 
	 * @param x
	 *            石を打とうとしている場所のx座標。
	 * @param y
	 *            石を打とうとしている場所のy座標。
	 * @param vecX
	 *            調べる方向を示すx方向ベクトル。
	 * @param vecY
	 *            調べる方向を示すy方向ベクトル。
	 * @return 石が打てるならtrue、打てないならfalseを返す。
	 * 
	 */
	canPutDown_ : function(x, y, vecX, vecY) {
		let xx = x;
		let yy = y;
		let putStone;

		// 打つ石はどれか
		if (this.flagForWhite) {
			putStone = WHITE_STONE;
		} else {
			putStone = BLACK_STONE;
		}

		// 隣の場所へ。どの隣かは(vecX, vecY)が決める。
		x += vecX;
		y += vecY;
		// 盤面外だったら打てない
		if (x < 0 || x >= MASU || y < 0 || y >= MASU)
			return false;
		// 隣が自分の石の場合は打てない
		if (this.board[y][x] == putStone)
			return false;
		// 隣が空白の場合は打てない
		if (this.board[y][x] == BLANK)
			return false;

		// さらに隣を調べていく
		x += vecX;
		y += vecY;
		// となりに石がある間ループがまわる
		while (x >= 0 && x < MASU && y >= 0 && y < MASU) {
			// 空白が見つかったら打てない（はさめないから）
			if (this.board[y][x] == BLANK)
				return false;
			// 自分の石があればはさめるので打てる
			if (this.board[y][x] == putStone) {
				//console.log("canPutDown_ : " + xx + ", " + yy + " = true");
				return true;
			}
			x += vecX;
			y += vecY;
		}
		// 相手の石しかない場合はいずれ盤面の外にでてしまうのでこのfalse
		return false;
	},

	/**
	 * 石をひっくり返す。
	 * 
	 * @param x
	 *            石を打った場所のx座標。
	 * @param y
	 *            石を打った場所のy座標。
	 * @param tryAndError
	 *            コンピュータの思考実験中かどうか。思考中は石を描画しない。
	 */
	reverse : function(/*Undo*/ undo, tryAndError) {
		// ひっくり返せる石がある方向はすべてひっくり返す
		if (this.canPutDown_(undo.x, undo.y, 1, 0))
			this.reverse_(undo, 1, 0, tryAndError);
		if (this.canPutDown_(undo.x, undo.y, 0, 1))
			this.reverse_(undo, 0, 1, tryAndError);
		if (this.canPutDown_(undo.x, undo.y, -1, 0))
			this.reverse_(undo, -1, 0, tryAndError);
		if (this.canPutDown_(undo.x, undo.y, 0, -1))
			this.reverse_(undo, 0, -1, tryAndError);
		if (this.canPutDown_(undo.x, undo.y, 1, 1))
			this.reverse_(undo, 1, 1, tryAndError);
		if (this.canPutDown_(undo.x, undo.y, -1, -1))
			this.reverse_(undo, -1, -1, tryAndError);
		if (this.canPutDown_(undo.x, undo.y, 1, -1))
			this.reverse_(undo, 1, -1, tryAndError);
		if (this.canPutDown_(undo.x, undo.y, -1, 1))
			this.reverse_(undo, -1, 1, tryAndError);
	},

	/**
	 * 石をひっくり返す。
	 * 
	 * @param x
	 *            石を打った場所のx座標。
	 * @param y
	 *            石を打った場所のy座標。
	 * @param vecX
	 *            ひっくり返す方向を示すベクトル。
	 * @param vecY
	 *            ひっくり返す方向を示すベクトル。
	 * @param tryAndError
	 *            コンピュータの思考実験中かどうか。思考中は石を描画しない。
	 */
	reverse_ : function(/*Undo*/ undo, vecX, vecY, tryAndError) {
		let putStone;
		let x = undo.x;
		let y = undo.y;

		if (this.flagForWhite) {
			putStone = WHITE_STONE;
		} else {
			putStone = BLACK_STONE;
		}

		// 相手の石がある間ひっくり返し続ける
		// (x,y)に打てるのは確認済みなので相手の石は必ずある
		x += vecX;
		y += vecY;
		while (this.board[y][x] != putStone) {
			// ひっくり返す
			this.board[y][x] = putStone;

			// ひっくり返した場所を記録しておく
			undo.pos[undo.count++] = Point.Point(x, y);
			if (!tryAndError) {
				this.stones.push([x,y]);
//				// カチッ
//				kachi.play();
//				// 盤面が更新されたので再描画
//				update(getGraphics());
				// 小休止を入れる（入れないと複数の石が一斉にひっくり返されてしまう）
				this.sleep();
			}
			x += vecX;
			y += vecY;
		}
	},

	/**
	 * オセロ盤を1手手前の状態に戻す。 AIは石を打ったり戻したりして盤面を評価できる。
	 * 
	 * @param undo
	 *            ひっくり返した石の情報。
	 */
	undoBoard : function(/*Undo*/ undo) {
		let c = 0;

		while (undo.pos[c] != null) {
			// ひっくり返した位置を取得
			let x = undo.pos[c].x;
			let y = undo.pos[c].y;
			// 元に戻すには-1をかければよい
			// 黒(1)は白(-1)に白は黒になる
			this.board[y][x] *= -1;
			c++;
		}
		// 石を打つ前に戻す
		this.board[undo.y][undo.x] = BLANK;
		// 手番も元に戻す
		this.nextTurn();
	},

	/**
	 * 手番を変える。
	 * 
	 */
	nextTurn : function() {
		// 手番を変える
		this.flagForWhite = ! this.flagForWhite;
	},

	/**
	 * 石が打てる場所の数を数える。
	 * 
	 * @return 石が打てる場所の数。
	 */
	countCanPutDownStone : function() {
		let count = 0;

		for (let y = 0; y < MASU; y++) {
			for (let x = 0; x < MASU; x++) {
				if (this.canPutDown(x, y)) {
					count++;
				}
			}
		}

		return count;
	},

	/**
	 * SLEEP_TIMEだけ休止を入れる
	 * 
	 */
	sleep : function() {
//		try {
//			Thread.sleep(SLEEP_TIME);
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		}
	},

	/**
	 * 画面の中央に文字列を表示する
	 * 
	 * @param g
	 *            描画オブジェクト
	 * @param s
	 *            描画したい文字列
	 */
	drawTextCentering : function(g, s) {
//		Font f = new Font("SansSerif", Font.BOLD, 20);
//		g.setFont(f);
//		FontMetrics fm = g.getFontMetrics();
//		g.setColor(Color.YELLOW);
//		g.drawString(s, WIDTH / 2 - fm.stringWidth(s) / 2, HEIGHT / 2 + fm.getDescent());
	},

	/**
	 * ゲームが終了したか調べる。
	 * 
	 */
	endGame : function() {
		// 打たれた石の数が60個（全部埋まった状態）以外は何もしない
		if (this.putNumber == END_NUMBER) {
			// 黒白両方の石を数える
			let /*Counter*/ counter = this.countStone();
			// 黒が過半数（64/2=32）を取っていたら勝ち
			// 過半数以下なら負け
			// 同じ数なら引き分け
			if (counter.blackCount > 32) {
				this.gameState = YOU_WIN;
			} else if (counter.blackCount < 32) {
				this.gameState = YOU_LOSE;
			} else {
				this.gameState = DRAW;
			}
//			repaint();
			return true;
		}
		return false;
	},

	/**
	 * オセロ盤上の石の数を数える
	 * 
	 * @return 石の数を格納したCounterオブジェクト
	 * 
	 */
	/*Counter*/ countStone : function() {
		let /*Counter*/ counter = Counter.Counter();

		for (let y = 0; y < MASU; y++) {
			for (let x = 0; x < MASU; x++) {
				if (this.board[y][x] == BLACK_STONE)
					counter.blackCount++;
				if (this.board[y][x] == WHITE_STONE)
					counter.whiteCount++;
			}
		}

		return counter;
	},

	/**
	 * (x,y)のボードの石の種類を返す。
	 * 
	 * @param x
	 *            X座標。
	 * @param y
	 *            Y座標。
	 * @return BLANK or BLACK_STONE or WHITE_STONE
	 */
	getBoard : function(x, y) {
		return this.board[y][x];
	}

//	public void mousePressed(MouseEvent e) {
//	}
//
//	public void mouseEntered(MouseEvent e) {
//	}
//
//	public void mouseExited(MouseEvent e) {
//	}
//
//	public void mouseReleased(MouseEvent e) {
//	}

	};

	mainPanel.GS = GS;
	mainPanel.MASU = MASU;
	mainPanel.board = [];
	for(let y=0; y<MASU; y++) {
		mainPanel.board[y] = [];
		for(let x=0; x<MASU; x++) {
			mainPanel.board[y][x] = null;
		}
	}
//	mainPanel.canPutDown = mainPanel.canPutDown.bind(mainPanel);
//	mainPanel.putDownStone = mainPanel.putDownStone.bind(mainPanel);
//	mainPanel.reverse = mainPanel.reverse.bind(mainPanel);
//	mainPanel.nextTurn = mainPanel.nextTurn.bind(mainPanel);
//	mainPanel.undoBoard = mainPanel.undoBoard.bind(mainPanel);
//	mainPanel.endGame = mainPanel.endGame.bind(mainPanel);
	return mainPanel;
}

module.exports = { MainPanel };
