/*******************************************
   StarTrek

	  2003/08/08  Ver00.90 公開

********************************************/

//import java.io.Serializable;
//import java.awt.*;
//import java.awt.event.*;
//import java.util.ArrayList;
//import java.util.List;

const StarTrek = function() {
	let i = _StarTrek_();

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

	i.println = function(val) {
		this.send2(val);
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
		if(v[0] == "move") {
			this.vecX = parseInt(v[1]);
			this.vecY = parseInt(v[2]);
			this.Move_calcMove();
			this.doResult();
			return;
		}
		if(v[0] == "warp") {
			this.vecX = parseInt(v[1]);
			this.vecY = parseInt(v[2]);
			this.Warp_calcWarp();
			this.doResult();
			return;
		}
		if(v[0] == "phaser") {
			this.attEnergy = parseInt(v[1]);
			this.Phaser_calcPhaser();
			this.doResult();
			return;
		}
		if(v[0] == "photon") {
			this.vecX = parseInt(v[1]);
			this.vecY = parseInt(v[2]);
			this.Photon_calcPhoton();
			this.doResult();
			return;
		}
		if(v[0] == "start") {
			this.doResult();
			return;
		}
	};

	i.doResult = function() {
		this.disp();
		this.println("quad " + (this.quadX - 1) + " " + (this.quadY - 1));
		this.println("sec " + (this.secX - 1) + " " + (this.secY - 1));
		let v = this.srMsg;
		for(let i=0; i<this.msgDialog.length; i++) {
			if(v.length > 0)
				v += "\n";
			let t = this.msgDialog[i];
			v += t;
		}
		this.println("msg " + v);
		this.msgDialog = [];
		this.println("level " + this.level);
		this.println("date " + this.starDate);
		this.println("left " + this.leftYear);
		switch(this.deckFlag){
		case 1: this.println("state " + "航海中"); break;
		case 2: this.println("state " + "基地に停泊中"); break;
		case 3: this.println("state " + "星に停泊中"); break;
		case 4: this.println("state " + "戦闘中"); break;
		}
		this.println("energy " + this.curEnergy + " " + this.maxEnergy);
		this.println("photon " + this.numPhotonTor + " " + this.maxPhotonTor);
		this.println("klingon " + this.allKlingon + " " + this.sKlingon);

//			str = "" + this.numAttack;
//			stPanel.insText("  Phaserの使用経験 = " + str + "\n");

		for(let j=0; j<8; j++) {
			let ln = "";
			for(let i=0; i<8; i++) {
				ln += this.srPanel[j][i];
			}
			this.println("short " + j + " " + ln);
		}
		for(let j=0; j<8; j++) {
			let ln = "";
			for(let i=0; i<8; i++) {
				ln += this.gmPanel[j][i] + " ";
			}
			this.println("game " + j + " " + ln.trim());
		}
	};

////	@doc("リセットする")
//	public String reset(
//			@doc("識別子") String id,
//			@doc("レベル") int level) throws Exception {
//		this.id = id;
//		connect();
//		StarTrek startrek = (StarTrek) select();
//		startrek.init(level);
//		String out = doResult(startrek);
//		update(startrek);
//		disconnect();
//		return out;
//	}

//	private String out;
//	@doc("ゲーム一覧を抽出する")
//	public String list(
//			@doc("識別子") String id) throws Exception {
//		connect();
//		if( ! exist()) create();
//		if(id == null || id.length() <= 0) {
//			id = "";
//			String ad = HttpRequest.getRemoteAddr();
//			if(ad != null && ad.length() > 0)
//				id = ad;
//		}
//		this.id = id;
//		out = Json.name("address");
//		out += Json.value(id);
//		out += ",";
//		out += Json.name("game");
//		out += "[";
//		Table callback = new Table() {
//			public boolean row(long count, List<String> name, Map<String,Object> values) {
//				Object v = values.get("time");
//				if(v != null && v instanceof Long) {
//					v = Util.DATE_FORMAT.format(
//							new Date(((Long)v).longValue()) );
//					values.put("time", v);
//				}
//				out += toJson(count, name, values);
//				return true;
//			}
//		};
//		select(callback);
//		out += "],";
//		disconnect();
//		return out;
//	}

//	@doc("スタートレックを開始する")
//	public String start(
//			@doc("識別子") String id) throws Exception {
//		this.id = id;
//		connect();
//		if( ! exist()) create();
//		StarTrek startrek = new StarTrek();
//		startrek.init();
//		try {
//			delete();
//		} catch (Exception e) {
//			// NONE
//		}
//		String out = doResult(startrek);
//		insert(startrek);
//		disconnect();
//		return out;
//	}

//	@doc("スタートレックをロードする")
//	public String load(
//			@doc("識別子") String id) throws Exception {
//		this.id = id;
//		connect();
//		StarTrek startrek = (StarTrek) select();
//		String out = doResult(startrek);
//		disconnect();
//		return out;
//	}

//	@doc("スタートレックを終了する")
//	public void bye(
//			@doc("識別子") String id) throws Exception {
//		this.id = id;
//		connect();
//		delete();
//		disconnect();
//	}

	return i;
}

const _StarTrek_ = function() {
	let starTrek = {

//	levelDialog	lvlDialog;
//	versionDialog  verDialog;
//	vectorDialog   vecDialog;
//	phaserDialog   psDialog;
//	messageDialog  msgDialog;
//	msg_okngDialog okngDialog;
//	textWindow	 hlpWindow, msgWindow;

	
	/**
	 * 
	 */
	msgDialog : [],
	msgDialog_disp : function( msg1, msg2) {
		this.msgDialog.push(msg1 + "\t" + msg2);
//
//		setSize( 200, 180 );
//		setLocation( 80, 80 );
//		msg1Label.setText(msg1);
//		msg2Label.setText(msg2);
//
//		show();
	},
	
	
//	public tempPanel lrPanel;
	srPanel : [],
	srMsg : null,
	stPanel : null,
	status : 0,
	gmPanel : [],

//	/*devSector*/  dSector : null,
//	/*initStatus*/ iStatus : null,

//	/*longRange*/ lRange : null,
//	/*shortRange*/ sRange : null,
//	/*statusReport*/ sReport : null,
//	/*galacticMap*/ gMap : null,

//	/*Warp*/ warp : null,
//	/*Move*/ move : null,
//	/*Phaser*/ phaser : null,
//	/*Photon*/ photon : null,

//	/*Game*/ game : null,

//	TextField xTextField, yTextField, pTextField;

	q : [],
	s : [],

	allKlingon : 0,
	sKlingon : 0,
	vecY : 0,
	vecX : 0,
	quadY : 0,
	quadX : 0,
	secY : 0,
	secX : 0,
	leftYear : 0,
	maxYear : 0,
	starDate : 0,
	curEnergy : 0,
	attEnergy : 0,
	maxEnergy : 0,
	numAttack : 0,
	numPhotonTor : 0,
	maxPhotonTor : 0,
	level : 0,
	okngStatus : 0,
	deckFlag : 0,
	runFlag : 0,
	contFlag : 0,

	menuItem : "",


/******************************
	StarTrek メインメソッド
******************************/
//	public static void main(String[] args){
//		StarTrek s = new StarTrek();
//		s.init();
////		s.show();
//	}


/******************************
	StarTrek 初期化メソッド
******************************/
//	public void init(){
//		init(0);
//	}
	init : function(req){
		if(req == undefined) req = 0;
//		addWindowListener(this);
//		setSize(600,480);
//		setTitle("StarTrek");

//// メニューバーの生成
//		menuBar mnuBar = new menuBar();

//// 表示用パネルの生成
//		lrPanel = new tempPanel("Long Range Sensors",	 "Long Range",   0x00ffff, 0xf0ffff);
//		srPanel = new tempPanel("Short Range Sensors",	"Short Range",  0x7fffd4, 0xffffff);
//		stPanel = new tempPanel("Status Report",		  "Status",	   0xffff00, 0xffffcc);
//		gmPanel = new tempPanel("Comulative Galactic Map","Galactic Map", 0xffb8c1, 0xf8f8ff);

//// Panelの配置
//		GridBagLayout	  panelLayout = new GridBagLayout();
//		GridBagConstraints panelCnst   = new GridBagConstraints();
//		setLayout(panelLayout);

//		panelCnst.gridwidth = 2;								//   1列
//		panelLayout.setConstraints(lrPanel, panelCnst);
//		add(lrPanel);
//
//		panelCnst.gridwidth = GridBagConstraints.REMAINDER;
//		panelLayout.setConstraints(srPanel, panelCnst);
//		add(srPanel);
//
//		Label sp1Label = new Label("");						 //   スペースの追加
//		panelCnst.gridwidth = GridBagConstraints.REMAINDER;
//		panelLayout.setConstraints(sp1Label, panelCnst);
//		add(sp1Label);
//
//		panelCnst.gridwidth = 2;								//   2列
//		panelLayout.setConstraints(stPanel, panelCnst);
//		add(stPanel);
//
//		panelCnst.gridwidth = GridBagConstraints.REMAINDER;
//		panelLayout.setConstraints(gmPanel, panelCnst);
//		add(gmPanel);
//
//		Label sp2Label = new Label("");						 //   スペースの追加
//		panelCnst.gridwidth = GridBagConstraints.REMAINDER;
//		panelLayout.setConstraints(sp2Label, panelCnst);
//		add(sp2Label);
//
//		panelCnst.gridwidth = 1;								//   3列
//		cmdButton wpButton = new cmdButton("ワープ");
//		panelLayout.setConstraints(wpButton, panelCnst);
//		add(wpButton);
//
//		cmdButton mvButton = new cmdButton("セクター内の移動");
//		panelLayout.setConstraints(mvButton, panelCnst);
//		add(mvButton);
//
//		cmdButton psButton = new cmdButton("Phaser");
//		panelLayout.setConstraints(psButton, panelCnst);
//		add(psButton);
//
//		panelCnst.gridwidth = GridBagConstraints.REMAINDER;
//		cmdButton ptButton = new cmdButton("Photon");
//		panelLayout.setConstraints(ptButton, panelCnst);
//		add(ptButton);

//// ダイアログの生成
//		lvlDialog  = new levelDialog(this);
//		verDialog  = new versionDialog(this);
//		vecDialog  = new vectorDialog(this);
//		psDialog   = new phaserDialog(this);
//		msgDialog  = new messageDialog(this);
//		okngDialog = new msg_okngDialog(this);
//		hlpWindow  = new textWindow("Help", "help.txt");
//		msgWindow  = new textWindow("ReadMe", "ReadMe.txt");

// 各種コマンドボタンの生成
//		this.lRange  = this.longRange();
//		this.sRange  = this.shortRange();
//		this.sReport = this.statusReport();
//		this.gMap	= this.galacticMap();

//		this.warp	= this.Warp();
//		this.move	= this.Move();
//		this.phaser  = this.Phaser();
//		this.photon  = this.Photon();

// ゲーム終了のチェックの生成
//		this.game	 = this.Game();

// レベルのデフォルト値(初級)の設定、その他
		this.runFlag	  = 0;	  //  実行中か否か(レベル設定で使用)
		this.contFlag	 = 0;	  //  継続するか否か
		this.maxYear	  = 50;
		this.maxEnergy	= 6000;
		this.maxPhotonTor = 20;
		this.level		= 3;	  //  デフォルトのレベル(初級)

		if (req == 2){
			this.maxYear	  = 40;
			this.maxEnergy	= 5000;
			this.maxPhotonTor = 15;
			this.level		= 2;
		}
		else
		if(req == 1) {
			this.maxYear	  = 30;
			this.maxEnergy	= 4000;
			this.maxPhotonTor = 10;
			this.level		= 1;
		}
		
// 宇宙(クオドランド、セクター等の初期化)
		this.initStatus_initial();

// セクターの展開
		this.devSector_develop();
	},

	disp : function(){
		this.longRange_lrDisp();
		this.shortRange_srDisp();
		this.statusReport_stDisp();
		this.galacticMap_gmDisp();
	},

///******************************
//	Windows イベントの設定
//******************************/
//	public void windowClosing(WindowEvent e){
//		dispose();				 //ウインドウを閉じる
//		System.exit(0);			 //アプリケーションを終了させる
//	}
//	public void windowOpened(WindowEvent e){}
//	public void windowClosed(WindowEvent e){}
//	public void windowIconified(WindowEvent e){}
//	public void windowDeiconified(WindowEvent e){}
//	public void windowActivated(WindowEvent e){}
//	public void windowDeactivated(WindowEvent e){}


/*****************************************************
	初期状態(クォドランド、エネルギー、etc)の設定
******************************************************/

	/********************************
		初期状態の設定メソッド
	********************************/
		initStatus_initial : function(){
			let i, j, cnt, klingon;

			for(i = 1; i < 9; i++){
				for(j = 1; j < 9; j++){
					this.q[i][j] = 1;	  // 最下位桁を long range sensor されたか否かの flag として使用
				}
			}

// ベースの配置(３ｹ)
			cnt = 0;
			do{
				i = parseInt( Math.random()*8 + 1 );
				j = parseInt( Math.random()*8 + 1 );

				if ( this.q[i][j] < 99 ){
					this.q[i][j] = parseInt( this.q[i][j] + 100 );
					cnt++;
				}
			}while( cnt < 3 );

// クリンゴンの配置(３０ｹ)
	 		cnt = 30;
			do{
				do{
					i = parseInt( Math.random()*8 + 1 );
					j = parseInt( Math.random()*8 + 1 );
				}while( this.q[i][j]  > 999 );

				klingon = parseInt( Math.random()*4 + 1 );	// １ｹのsector内にmax.５ｹ
				if ( cnt > klingon ){
					this.q[i][j] = parseInt( this.q[i][j] + klingon*1000 ); 
				}
				else{
					this.q[i][j] = parseInt( this.q[i][j] + cnt*1000 ); 
				}

				cnt	 = parseInt( cnt - klingon );
			}while( cnt > 0 );

// 星の配置
			for(i = 1; i < 9; i++){
				for(j = 1; j < 9; j++){
					this.q[i][j] += parseInt(Math.random() * 6) * 10; // １ｹ sectorにmax.６ｹ
				}
			}

// クォドランドの位置
			this.quadY = parseInt( Math.random()*8 + 1 );
			this.quadX = parseInt( Math.random()*8 + 1 );

// 初期値の設定(デフォルトは初級)
			this.leftYear	= parseInt( this.maxYear + Math.random() * 6 );
			this.allKlingon   = 30;
			this.curEnergy	= this.maxEnergy;
			this.numPhotonTor = this.maxPhotonTor;
			this.starDate	 = 2100;
			this.numAttack	= 0;
		},


/**********************************************************
	this.q[this.quadY][this.quadX]をセクターに展開
***********************************************************/
//		千の位 クリンゴン
//		百の位 ベース
//		十の位 星
//		一の位 long range sensor されたか否かの flag


	/********************************
		セクター展開のメソッド
	********************************/
		devSector_develop : function(){
			let base, star, k, cnt, i, j;

			for(i = 1; i < 9; i++){
				for(j = 1; j < 9; j++){
					this.s[i][j] ='.';
				}
			}

			k = parseInt( this.q[this.quadY][this.quadX]/10 );
			this.sKlingon = parseInt( k/100 );
			base = parseInt((k- this.sKlingon*100)/10 );
			star = parseInt( k- this.sKlingon*100 - base*10 );
			this.q[this.quadY][this.quadX] = parseInt( k*10 );
			this.deckFlag = 1;

			do{
				i = parseInt(Math.random()*8 + 1);
				j = parseInt(Math.random()*8 + 1);
			}while( this.s[i][j] != '.' );
			this.s[i][j] = 'E';
			this.secY = i;
			this.secX = j;

			cnt = this.sKlingon;
			while( cnt > 0){
				do{
					i = parseInt(Math.random()*8 + 1);
					j = parseInt(Math.random()*8 + 1);
				}while(this.s[i][j] != '.' );
				this.s[i][j] = 'K';
				cnt --;
			};

			if (base != 0){
				do{
					i = parseInt(Math.random()*8 + 1);
					j = parseInt(Math.random()*8 + 1);
				}while(this.s[i][j] != '.' );
				this.s[i][j] = 'B';
			}

			cnt = star;
			while( cnt > 0){
				do{
					i = parseInt(Math.random()*8 + 1);
					j = parseInt(Math.random()*8 + 1);
				}while( this.s[i][j] != '.'  );
				this.s[i][j] = 'S';
				cnt--;
			};
		},


/****************************
	Long Range Sensor
****************************/

	/***************************************
		Long Range Sensorの表示メソッド
	***************************************/
		longRange_lrDisp : function(){
			let i, j, w;

			this.curEnergy = parseInt(this.curEnergy - 30 );
			this.Game_isGameOver();
			if (this.contFlag == 1){
				return;
			}

//			lrPanel.clsText();						 // 画面のクリア
//			lrPanel.insText("\n\n\n\n");

			for (j = parseInt(this.quadX + 1); j > parseInt(this.quadX - 2); j--) {
//				lrPanel.insText("			 ");
				for (i = parseInt(this.quadY-1); i< parseInt(this.quadY+2); i++) {
					if ( i == 0 || i == 9 || j == 0 || j == 9){
//						lrPanel.insText("***  ");	  // 境界を越えた場合 *** を表示
					} else {
						w = parseInt( this.q[i][j]/10 );	   //	一の位(sensor されたか否かの flag)をクリア
						this.q[i][j] = parseInt( w*10 );	 //   一の位をクリア

//						if (w > 99 ){
//							lrPanel.insText(	   Integer.toString(w) + "  ");
//						}
//						else if (w > 9){
//							lrPanel.insText("0"  + Integer.toString(w) + "  ");
//						}
//						else{
//							lrPanel.insText("00" + Integer.toString(w) + "  ");
//						}
					}
				}
//				lrPanel.insText("\n");
			}
		},

/****************************
	Short Range sensor
****************************/

	/***************************************
		Short Range Sensorの表示メソッド
	***************************************/
		shortRange_srDisp : function(){
			let i, j;

			this.curEnergy = parseInt( this.curEnergy - 10 );
			this.Game_isGameOver();
			if (this.contFlag == 1){
				return;
			}

//			srPanel.clsText();				   // 画面のクリア
//			srPanel.insText("\n");
			this.srMsg = "";

			for (j = 8; j > 0; j--){
//				srPanel.insText("		");
				for (i = 1; i <9; i++){
//					srPanel.insText( this.s[i][j] + " ");
					this.srPanel[i - 1][j - 1] = this.s[i][j];
				}
//				srPanel.insText("\n");
			}
//			srPanel.insText("\n");

			switch(this.deckFlag){
				case 2:
//						srPanel.insText( "		 Docked in Base" );
						this.srMsg = "Docked in Base";
						break;
				case 3:
//						srPanel.insText( "		 Docked in Star" );
						this.srMsg = "Docked in Star";
						break;
				case 4:
//						srPanel.insText( "		 Fight Klingons" );
						this.srMsg = "Fight Klingons";
						break;
			}
		},

/****************************
	Status report
****************************/

	/***************************************
		Status reportの表示メソッド
	***************************************/
		statusReport_stDisp : function(){
			let str;

			this.curEnergy   = parseInt( this.curEnergy - 5 );
			this.Game_isGameOver();
			if (this.contFlag == 1){
				return;
			}

//			stPanel.clsText();				   // 画面のクリア
//			stPanel.insText("\n");
			this.stPanel = "";

			str = "" + this.starDate;
//			stPanel.insText("				宇宙暦 = " + str + " 年\n");
			this.stPanel += "宇宙暦: " + str + " 年";
			str = "" + this.leftYear;
//			stPanel.insText("			  残り年月 = " + str + "\n");
			this.stPanel += "、 残り年月: " + str + "\n";
			this.status = 0;
			switch(this.deckFlag){
			case 1: str = "航海中"; break;
			case 2: str = "基地に停泊中"; status = -1; break;
			case 3: str = "星に停泊中"; status = -1; break;
			case 4: str = "クリンゴンと戦闘中"; status = 1; break;
			}
//			stPanel.insText("				  状況 : " + str + "\n");
			this.stPanel += "状況: " + str;
			str = "" + this.curEnergy;
//			stPanel.insText("			エネルギー = " + str + " unit\n");
			this.stPanel += "、 残エネルギー: " + str + "\n";
//			str = "" + this.quadX;
//			stPanel.insText("				現在地 = " + str + " - " +Integer.toString(this.quadX)+"\n");
			str = "" + this.numPhotonTor;
//			stPanel.insText("			Photon数 = " + str + "\n");
			this.stPanel += "残Photon: " + str + "\n";
			str = "" + this.numAttack;
//			stPanel.insText("  Phaserの使用経験 = " + str + "\n");
			this.stPanel += "Phaserの使用経験: " + str + "\n";
			str = "" + this.allKlingon;
//			stPanel.insText("		全クリンゴン数 = " + str + "\n");
			this.stPanel += "残クリンゴン数: " + str + "";
			str = "" + this.sKlingon;
//			stPanel.insText("  小宇宙内クリンゴン数 = " + str + "\n");
			this.stPanel += " (小宇宙内: " + str + ")\n";
		},

/****************************
	Galactic Map
****************************/

	/***************************************
		Galactic Mapの表示メソッド
	***************************************/
		galacticMap_gmDisp : function(){
			let i, j, w;

			this.curEnergy   = parseInt( this.curEnergy - 10 );
			this.Game_isGameOver();
			if (this.contFlag == 1){
				return;
			}

//			gmPanel.clsText();					  // 画面のクリア
//			gmPanel.insText("\n");

			for (j = 8; j > 0; j--){
//				gmPanel.insText("   ");
				for (i = 1; i < 9; i++){
					w = parseInt( this.q[i][j]/10 );
					if ( w*10 != this.q[i][j] ){
//						gmPanel.insText("***  ");  // まだセンスされてない部分
						this.gmPanel[i - 1][j - 1] = -1;
					}
					else if ( w >99 ){
//						gmPanel.insText(		Integer.toString(w) + "  " );
						this.gmPanel[i - 1][j - 1] = w;
					}
					else if (w > 9){
//						gmPanel.insText( "0"  + Integer.toString(w) + "  " );
						this.gmPanel[i - 1][j - 1] = w;
					}
					else{
//						gmPanel.insText( "00" + Integer.toString(w) + "  " );
						this.gmPanel[i - 1][j - 1] = w;
					}
				}
//				gmPanel.insText("\n");
			}
		},


/************************************
	ワープ[セクター間の移動](Warp)
*************************************/

	/******************************
		ワープの計算メソッド
	******************************/
		Warp_calcWarp : function(){
			let x, y, dist, f_err;
			let wrk;

			if ( this.vecY == 0 && this.vecX == 0 ){
				return;
			}

			y = parseInt( this.quadY + this.vecY );
			x = parseInt( this.quadX + this.vecX );

			f_err = 0;
			if ( x > 8 ){ x = 8; f_err = 1; }
			if ( x < 1 ){ x = 1; f_err = 1; }
			if ( y > 8 ){ y = 8; f_err = 1; }
			if ( y < 1 ){ y = 1; f_err = 1; }

			this.quadY = y;
			this.quadX = x;

			if ( f_err == 1 ){
				wrk = "" + (this.quadX - 1)  + "," + (this.quadY - 1);
				this.msgDialog_disp( "宇宙の限界を超えてしまう!!", "(" +wrk+ ")までワープ");
			}

			this.leftYear  = parseInt( this.leftYear  - 2 );
			this.starDate  = parseInt( this.starDate  + 2 );
			dist	  = parseInt( Math.sqrt( Math.pow( 2, this.vecY) + Math.pow( 2, this.vecX ) ) );
			this.curEnergy = parseInt( this.curEnergy - dist*50 );
			this.Game_isGameOver();
			if (this.contFlag == 1){
				return;
			}
			this.devSector_develop();
		},


/****************************
	Move(セクター内の移動)
****************************/

	/**************************************
		セクター内の移動の計算メソッド
	***************************************/
		Move_calcMove : function(){
			let x, y, w;

			if ( this.vecY == 0 && this.vecX == 0 ){
				return;
			}

			y = parseInt( this.secY + this.vecY );
			x = parseInt( this.secX + this.vecX );

			if ( x > 8 || x < 1 || y > 8 || y < 1 ){
				this.vecY = 0;
				this.vecX = 0;
				if ( y > 8 ) this.vecY = 1;
				if ( y < 1) this.vecY = -1;
				if ( x > 8 ) this.vecX = 1;
				if ( x < 1) this.vecX = -1;

				this.msgDialog_disp( "隣のクォドランドへワープ", "");
				this.Warp_calcWarp();
			}
			else{
				switch(this.s[y][x]){
					case '.':
						switch(this.deckFlag){			   // 前の状態へ戻す
							case 2:
								this.s[this.secY][this.secX] = 'B';
								break;
							case 3:
								this.s[this.secY][this.secX] = 'S';
								break;
							default:
								this.s[this.secY][this.secX] = '.';
								break;
						}
						this.deckFlag =1;
						break;

					case 'B':							  // エネルギー、Photonの補給
						this.s[this.secY][this.secX] = '.';
						this.deckFlag	  = 2;
						this.curEnergy	 = this.maxEnergy;
						this.numPhotonTor  = this.maxPhotonTor;
						break;

					case 'S':							  // エネルギー 500 unit の補給
						this.s[this.secY][this.secX] = '.';
						this.deckFlag	  = 3;
						this.curEnergy	 = parseIntMath.min( (this.curEnergy + 500), this.maxEnergy );
						break;

					case 'K':
						this.s[this.secY][this.secX] = '.';
						this.deckFlag = 4;
						this.msgDialog_disp( "クリンゴンヘ体当たり(１基撃沈)", "1000 unit のエネルギーの損失");
						this.curEnergy = parseInt( this.curEnergy  - 1000 );
						this.Game_isGameOver();
						if (this.contFlag == 1){
							return;
						}
						this.sKlingon = parseInt( this.sKlingon   - 1   );
						this.allKlingon = parseInt( this.allKlingon - 1   );
						this.Game_isGameWin();
						break;
				}
				this.s[y][x] = 'E';
				this.secY = y;
				this.secX = x;
				this.shortRange_srDisp();
			}

			this.leftYear--;
			this.starDate++;
			w = parseInt( Math.sqrt( Math.pow( 2, this.vecY) + Math.pow( 2, this.vecX ) ));
			this.curEnergy = parseInt( this.curEnergy - w*20 );
			this.Game_isGameOver();
		},


/****************************
	Phaser(Phaser)
****************************/

	/******************************
		Phaserの計算メソッド
	******************************/
		Phaser_calcPhaser : function(){
			let sink, i, j, w;
			let msg;

			if ( this.attEnergy < 0 ){
				return ;
			}

			this.curEnergy = parseInt( this.curEnergy - this.attEnergy );
			this.Game_isGameOver();
			if (this.contFlag == 1){
				return;
			}

			if ( this.sKlingon == 0 ){
				this.msgDialog_disp( "クリンゴンが居ません", "エネルギーの無駄使い");
				return;
			}

			this.numAttack++;
			if ( this.attEnergy <= this.sKlingon*( 400/this.numAttack ) ){
				this.msgDialog_disp( "攻撃量が不足", "攻撃できません");
				return;
			}

			sink = parseInt( Math.random()*this.sKlingon + 1 );
			msg  = sink + "基 のクリンゴン撃沈";
			this.msgDialog_disp( msg, "" );

			this.q[this.quadY][this.quadX] = parseInt( this.q[this.quadY][this.quadX] - sink*1000 );

			w		  = this.sKlingon;
			this.sKlingon   = parseInt(Math.max((this.sKlingon - sink ), 0 ));
			this.allKlingon = parseInt(this.allKlingon - sink );
			this.Game_isGameWin();

			if ( this.sKlingon > 0 ){
				w = sink;
			}

			for (i = 1; i < 9; i++){			  // 撃沈分の'K'を'.'へ変更
				for (j = 1; j < 9; j++){
					if (this.s[i][j] == 'K'){
						this.s[i][j] = '.';
						w--;
						if ( w <= 0 )
							break;
					}
				}
				if ( w <= 0 )
					break;
			}
			this.shortRange_srDisp();
		},


/****************************
	Photon(Photon Tor.)
****************************/

	/******************************
		Photonの計算メソッド
	******************************/
		Photon_calcPhoton : function(){
//			short i, j;
			let w;
			let msg1, msg2;

			this.numPhotonTor--;
			if ( this.numPhotonTor < 0 ){
				this.msgDialog_disp( "Photonが残ってない。", "残念、無念");
				return;
			}

			if ( (this.vecY == 0) && (this.vecX == 0) ){
				return;
			}

			this.vecY = parseInt( this.secY + this.vecY );
			this.vecX = parseInt( this.secX + this.vecX );

			msg1 = "" + (this.vecY - 1);
			msg2 = "" + (this.vecX - 1);
			msg1 = "(" + msg2 + "," + msg1 + ") を攻撃";
			if ( this.level == 3 ){
//				msg2 = "続けますか ？";
//				okngStatus = 0;
//				okngDialog.disp( msg1,msg2);
//				if ( okngStatus == 0 )				// NG
//				{
//					return;
//				}
			}

			w = parseInt(Math.sqrt( Math.pow( 2, this.vecY) + Math.pow( 2, this.vecX ) ));
			this.curEnergy = parseInt(this.curEnergy - w*30);
			this.Game_isGameOver();
			if (this.contFlag == 1){
				return;
			}

			if (this.vecY < 1 || this.vecY > 8
			 || this.vecX < 1 || this.vecX > 8
			 || this.s[this.vecY][this.vecX] == '.'){
				this.msgDialog_disp( "攻撃失敗(攻撃先が異常)", msg1 );
				return;
			}

			if ( Math.random() < 0.2  ){
				this.msgDialog_disp( "攻撃失敗", "不発" );
			}
			else{
				switch( this.s[this.vecY][this.vecX] ){
					case 'K':
						this.allKlingon--;
						this.sKlingon--;
						this.q[this.quadY][this.quadX] = parseInt( this.q[this.quadY][this.quadX] - 1000 );
						this.s[this.vecY][this.vecX]   = '.';
						this.msgDialog_disp( "クリンゴンを撃沈", "");
						this.Game_isGameWin();
						break;

					case 'B':
						this.q[this.quadY][this.quadX] = parseInt( this.q[this.quadY][this.quadX] -  100 );
						this.s[this.vecY][this.vecX]   = '.';
						this.msgDialog_disp( "ベースを破壊", "");
						break;

					case 'S':
						this.q[this.quadY][this.quadX] = parseInt( this.q[this.quadY][this.quadX] -   10 );
						this.s[this.vecY][this.vecX]   = '.';
						this.msgDialog_disp( "星を破壊", "");
						break;
				}
				this.shortRange_srDisp();
			}
		},


///************************************
//	表示、コマンド用 共通パネル
//*************************************/
//	public class tempPanel extends Panel implements ActionListener{
//		Button tempButton;
//		TextArea tempTextArea;
//
//		public tempPanel(String title, String btitle, int rgbLabel, int rgbTextArea){
//			super();					 //上位クラス(Panel) のコンストラクタの呼び出し
//
//			setLayout( new BorderLayout() );
//
//			Label tempLabel = new Label(title);
//			Color lblColor  = new Color(rgbLabel);
//			tempLabel.setBackground(lblColor);
//
//			tempTextArea = new TextArea( "", 8, 36, tempTextArea.SCROLLBARS_NONE );
//			tempTextArea.setEditable( false );			  // 書き込み禁止
//			Color textAreaColor = new Color(rgbTextArea);
//			tempTextArea.setBackground(textAreaColor);
//
//			tempButton = new Button(btitle);
//			tempButton.addActionListener(this);
//
//			add("North",  tempLabel);
//			add("Center", tempTextArea);
//			add("South",  tempButton);
//		}
//
//
//	/****************************
//		文字列の挿入メソッド
//	*****************************/
//		public void insText(String str){
//			tempTextArea.append( str );
//		}
//
//
//	/****************************
//		画面のクリアメソッド
//	*****************************/
//		public void clsText(){
//			tempTextArea.setText("");
//		}
//
//	/********************************
//		アクションイベントの設定
//	*********************************/
//		public void actionPerformed(ActionEvent e){
//			runFlag = 1;
//			String buttonLabel = tempButton.getLabel();
//
//			if ("Long Range".equals(buttonLabel)){
//				lRange.lrDisp();
//			}
//			else if	("Short Range".equals(buttonLabel)){
//				sRange.srDisp();
//			}
//			else if	("Status".equals(buttonLabel)){
//				sReport.stDisp();
//			}
//			else if	("Galactic Map".equals(buttonLabel)){
//				gMap.gmDisp();
//			}
//			else{
//				return ;
//			}
//		}
//	}


///*********************************
//	コマンドボタン
//**********************************/
//	public class cmdButton extends Button implements ActionListener	{
//		public cmdButton(String cmd){
//			super(cmd);
//			addActionListener(this);
//		}
//
//	/*********************************
//		アクションイベントの設定
//	*********************************/
//		public void actionPerformed(ActionEvent e){
//			runFlag = 1;
//			String buttonLabel = getLabel();
//
//			if ("ワープ".equals(buttonLabel)){
//				if (level != 3){
//					gmPanel.clsText();						 // gmの表示をクリア
//				}
//				vecDialog.disp( "ワープ(セクター間の移動)" );  // ベクトル入力のダイアログの表示
//				warp.calcWarp();
//			}
//			else if	("セクター内の移動".equals(buttonLabel)){
//				if (level != 3){
//					gmPanel.clsText();						 // gmの表示をクリア
//				}
//				vecDialog.disp( "セクター内の移動" );		  // ベクトル入力のダイアログの表示
//				move.calcMove();
//			}
//			else if	("Phaser".equals(buttonLabel)){
//				if (level != 3){
//					gmPanel.clsText();						 // gmの表示をクリア
//				}
//				psDialog.disp();							   // Phaser 攻撃のダイアログの表示
//				phaser.calcPhaser();
//			}
//			else if	("Photon".equals(buttonLabel)){
//				if (level != 3){
//					gmPanel.clsText();						 // gmの表示をクリア
//				}
//				vecDialog.disp( "Photon" );				  // ベクトル入力のダイアログの表示
//				photon.calcPhoton();
//			}
//			else{
//				return ;
//			}
//		}
//	}


///**************************************************
//	ベクトル入力(Warp, Move, Phton)のダイアログ
//***************************************************/
//	public class vectorDialog extends Dialog implements ActionListener,WindowListener{
//		Button okButton;
//		Label  msgLabel;
//
//		public vectorDialog(Frame parent){
//			super(parent, "ベクトルの入力", true);
//
//			GridBagLayout	  dialogLayout = new GridBagLayout();
//			GridBagConstraints dialogCnst   = new GridBagConstraints();
//			setLayout(dialogLayout);
//
//			msgLabel = new Label(" ");						//   1列
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(msgLabel, dialogCnst);
//			add( msgLabel );
//
//			Label sp1Label = new Label("   ");				//   スペースの追加
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(sp1Label, dialogCnst);
//			add(sp1Label);
//
//			Label xLabel = new Label("Ｘ方向");			   //   2列
//			add(xLabel);
//
//			xTextField = new TextField( 4 );
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(xTextField, dialogCnst);
//			add(xTextField);
//
//			Label yLabel = new Label("Ｙ方向");			   //   3列
//			add(yLabel);
//
//			yTextField = new TextField( 4 );
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(yTextField, dialogCnst);
//			add(yTextField);
//
//			Label sp2Label = new Label("   ");				//   スペースの追加
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(sp2Label, dialogCnst);
//			add(sp2Label);
//
//			okButton = new Button("OK");					  //   4列
//			okButton.addActionListener(this);
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(okButton, dialogCnst);
//			add( okButton );
//		}
//
//	/*******************************************
//		ベクトル入力ダイアログの表示メソッド
//	********************************************/
//		public void disp( String msg ){
//			setSize( 200, 180 );
//			setLocation( 100, 100 );
//			msgLabel.setText(msg);
//			show( );
//		}
//
//	/******************************
//		Windows イベントの設定
//	******************************/
//		public void windowClosing(WindowEvent e){
//			hide();
//		}
//		public void windowOpened(WindowEvent e){}
//		public void windowClosed(WindowEvent e){}
//		public void windowIconified(WindowEvent e){}
//		public void windowDeiconified(WindowEvent e){}
//		public void windowActivated(WindowEvent e){}
//		public void windowDeactivated(WindowEvent e){}
//
//
//	/******************************
//		アクションイベントの設定
//	******************************/
//		public void actionPerformed(ActionEvent e){
//			String strX, strY;
//			int x, y;
//
//			strX = xTextField.getText();
//			xTextField.setText("");
//			try{										 // 文字列を数値に変換(Ｘ方向)
//				x = Integer.valueOf( strX ).intValue();
//			}catch(NumberFormatException f){
//				x = 0;
//				curEnergy = parseInt( curEnergy - 100 );
//				msgDialog.disp( "Ｘ方向の入力を誤まった。", "100 unitのエネルギーを浪費" );
//			}
//			vecY =parseIntx;
//
//			strY = yTextField.getText();
//			yTextField.setText("");
//			try{										 // 文字列を数値に変換(Ｙ方向)
//				y =Integer.valueOf( strY ).intValue();
//			}catch(NumberFormatException f){
//				curEnergy = parseInt( curEnergy - 100 );
//				msgDialog.disp( "Ｙ方向の入力を誤まった。", "100 unitのエネルギーを浪費");
//				y = 0;
//			}
//			vecX =parseInty;
//
//			if ( vecY > 99 | vecY < -99 || vecX > 99 | vecX < -99 ){
//				curEnergy = parseInt( curEnergy - 100 );
//				msgDialog.disp( "入力を誤まった。", "100 unitのエネルギーを浪費");
//			}
//
//			game.isGameOver();
//			hide();
//			return ;
//		}
//	}


///*********************************
//	Phaser 攻撃のダイアログ
//**********************************/
//	public class phaserDialog extends Dialog implements ActionListener,WindowListener{
//		Button okButton;
//		Label  msgLabel;
//
//		public phaserDialog(Frame parent)	{
//			super(parent, "Phaser 攻撃量の入力", true);
//
//			GridBagLayout	  dialogLayout = new GridBagLayout();
//			GridBagConstraints dialogCnst   = new GridBagConstraints();
//			setLayout(dialogLayout);
//
//			msgLabel  = new Label(" ");					  //  1列(Phaser使用回数の表示用)
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(msgLabel, dialogCnst);
//			add(msgLabel);
//
//			Label xLabel = new Label("Phaser 攻撃量");   //   2列
//			add(xLabel);
//
//			pTextField	  = new TextField( 5 );
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(pTextField, dialogCnst);
//			add(pTextField);
//
//			Label sp2Label  = new Label("   ");			  //   スペースの追加
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(sp2Label, dialogCnst);
//			add(sp2Label);
//
//			okButton = new Button("OK");					  //   3列
//			okButton.addActionListener(this);
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(okButton, dialogCnst);
//			add( okButton );
//		}
//
//	/***********************************************
//		Phaser攻撃ダイアログの表示メソッド
//	************************************************/
//		public void disp()	{
//			String msg;
//			int w;
//
//			setSize( 200, 150 );
//			setLocation( 100, 100 );
//
//			w = numAttack;
//			w++;
//			msg = Integer.toString(w);
//			msg = msg + " 回目の使用";
//			msgLabel.setText(msg);
//
//			show();
//		}
//
//
//	/******************************
//		Windows イベントの設定
//	******************************/
//		public void windowClosing(WindowEvent e){
//			hide();
//		}
//		public void windowOpened(WindowEvent e){}
//		public void windowClosed(WindowEvent e){}
//		public void windowIconified(WindowEvent e){}
//		public void windowDeiconified(WindowEvent e){}
//		public void windowActivated(WindowEvent e){}
//		public void windowDeactivated(WindowEvent e){}
//
//
//	/******************************
//		アクションイベントの設定
//	******************************/
//		public void actionPerformed(ActionEvent e)	{
//			String str;
//			int w;
//
//			str = pTextField.getText();
//			pTextField.setText("");
//
//			try{
//				w =Integer.valueOf( str ).intValue();	 // 文字列を数値に変換
//			}catch(NumberFormatException f){
//				msgDialog.disp( "入力を誤まった。", "100 unitのエネルギーを浪費");
//				curEnergy = parseInt( curEnergy - 100 );
//				game.isGameOver();
//				w = -1;	 // 計算処理(calcPhaser)のフラグとして利用 マイナスの場合、計算処理なし
//			}
//
//			attEnergy =parseIntw;
//
//			hide();
//			return ;
//		}
//	}


///*********************************
//	メッセージ表示のダイアログ
//**********************************/
//	public class messageDialog extends Dialog implements ActionListener,WindowListener{
//		Button okButton;
//		Label msg1Label, msg2Label;
//
//		public messageDialog(Frame parent)	{
//			super(parent, "メッセージ表示", true);
//
//			GridBagLayout	  dialogLayout = new GridBagLayout();
//			GridBagConstraints dialogCnst   = new GridBagConstraints();
//			setLayout(dialogLayout);
//
//			msg1Label = new Label( " " );					//   1列
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(msg1Label, dialogCnst);
//			add( msg1Label );
//
//			Label sp1Label = new Label("   ");			   //   スペースの追加
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(sp1Label, dialogCnst);
//			add(sp1Label);
//
//			msg2Label = new Label( " " );					//   2列
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(msg2Label, dialogCnst);
//			add( msg2Label );
//
//			Label sp2Label = new Label("   ");			   //   スペースの追加
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(sp2Label, dialogCnst);
//			add(sp2Label);
//
//			okButton = new Button("OK");					 //   4列
//			okButton.addActionListener(this);
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(okButton, dialogCnst);
//			add( okButton );
//		}
//
//
//	/********************************************
//		メッセージダイアログの表示メソッド
//	*********************************************/
//		public void disp( String msg1, String msg2 ){
//
//			setSize( 200, 180 );
//			setLocation( 80, 80 );
//			msg1Label.setText(msg1);
//			msg2Label.setText(msg2);
//
//			show();
//		}
//
//
//	/******************************
//		Windows イベントの設定
//	******************************/
//		public void windowClosing(WindowEvent e){
//			hide();
//		}
//		public void windowOpened(WindowEvent e){}
//		public void windowClosed(WindowEvent e){}
//		public void windowIconified(WindowEvent e){}
//		public void windowDeiconified(WindowEvent e){}
//		public void windowActivated(WindowEvent e){}
//		public void windowDeactivated(WindowEvent e){}
//
//
//	/******************************
//		アクションイベントの設定
//	******************************/
//		public void actionPerformed(ActionEvent e){
//			hide();
//			return ;
//		}
//	}


///******************************************
//	メッセージ(ok,ng)表示のダイアログ
//*******************************************/
//	public class msg_okngDialog extends Dialog implements ActionListener,WindowListener{
//		Button okButton;
//		Button ngButton;
//		Label msg1Label, msg2Label;
//
//		public msg_okngDialog(Frame parent)	{
//			super(parent, "確認", true);
//			addWindowListener(this);
//
//			GridBagLayout	  dialogLayout = new GridBagLayout();
//			GridBagConstraints dialogCnst   = new GridBagConstraints();
//			setLayout(dialogLayout);
//
//			msg1Label = new Label( " " );					//   1列
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(msg1Label, dialogCnst);
//			add( msg1Label );
//
//			Label sp1Label = new Label("   ");			   //   スペースの追加
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(sp1Label, dialogCnst);
//			add(sp1Label);
//
//			msg2Label = new Label( " " );					//   2列
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(msg2Label, dialogCnst);
//			add( msg2Label );
//
//			Label sp2Label = new Label("   ");			   //   スペースの追加
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(sp2Label, dialogCnst);
//			add(sp2Label);
//
//			okButton = new Button("ＯＫ");					 //   4列
//			okButton.addActionListener(this);
//			add( okButton );
//			ngButton = new Button("ＮＧ");
//			ngButton.addActionListener(this);
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(ngButton, dialogCnst);
//			add( ngButton );
//		}
//
//
//	/*************************************************
//		メッセージ(ok,ng)ダイアログの表示メソッド
//	**************************************************/
//		public void disp( String msg1, String msg2 ){
//			setSize( 200, 180 );
//			setLocation( 80, 80 );
//			msg1Label.setText(msg1);
//			msg2Label.setText(msg2);
//
//			show();
//		}
//
//
//	/********************************
//		Windows イベントの設定
//	********************************/
//		public void windowClosing(WindowEvent e){
//			hide();
//		}
//		public void windowOpened(WindowEvent e){}
//		public void windowClosed(WindowEvent e){}
//		public void windowIconified(WindowEvent e){}
//		public void windowDeiconified(WindowEvent e){}
//		public void windowActivated(WindowEvent e){}
//		public void windowDeactivated(WindowEvent e){}
//
//
//	/********************************
//		アクションイベントの設定
//	********************************/
//		public void actionPerformed(ActionEvent e){
//			Object src = e.getSource();
//			String  buttonLabel = ((Button)src).getLabel();
//
//			if ("ＯＫ".equals(buttonLabel)){
//				okngStatus = 1;
//				hide();
//				return;
//			}
//			else{
//				okngStatus = 0;
//				hide();
//				return;
//			}
//		}
//	}


///*********************************
//	レベル設定のダイアログ
//**********************************/
//	public class levelDialog extends Dialog implements ActionListener,WindowListener{
//		Button okButton;
//		Checkbox selectedCheckbox;
//		CheckboxGroup chkboxGroup = new CheckboxGroup();
//		Checkbox lowlevel	= new Checkbox( "初級", chkboxGroup, true  );
//		Checkbox middlelevel = new Checkbox( "中級", chkboxGroup, false );
//		Checkbox highlevel   = new Checkbox( "上級", chkboxGroup, false );
//
//		public levelDialog(Frame parent){
//			super(parent, "レベル設定", true);
//
//			GridBagLayout	  dialogLayout = new GridBagLayout();
//			GridBagConstraints dialogCnst   = new GridBagConstraints();
//			setLayout(dialogLayout);
//
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;	// 初級
//			dialogLayout.setConstraints(lowlevel, dialogCnst);
//			add(lowlevel);
//
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;	// 中級
//			dialogLayout.setConstraints(middlelevel, dialogCnst);
//			add(middlelevel);
//
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;	// 上級
//			dialogLayout.setConstraints(highlevel, dialogCnst);
//			add(highlevel);
//
//			Label sp2Label = new Label("   ");				 //   スペースの追加
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(sp2Label, dialogCnst);
//			add(sp2Label);
//
//			okButton = new Button("OK");
//			okButton.addActionListener(this);
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(okButton, dialogCnst);
//			add( okButton );
//		}
//
//
//	/******************************************
//		レベル設定ダイアログの表示メソッド
//	*******************************************/
//		public void disp()	{
//			if ( runFlag == 1 ){
//				msgDialog.disp( "航海に出てしまいませた", "   もう変更はできません");
//				return;
//			}
//
//			setSize( 200, 180 );
//			setLocation( 100, 100 );
//			show();
//		}
//
//
//	/********************************
//		Windows イベントの設定
//	********************************/
//		public void windowClosing(WindowEvent e){
//			hide();
//		}
//		public void windowOpened(WindowEvent e){}
//		public void windowClosed(WindowEvent e){}
//		public void windowIconified(WindowEvent e){}
//		public void windowDeiconified(WindowEvent e){}
//		public void windowActivated(WindowEvent e){}
//		public void windowDeactivated(WindowEvent e){}
//
//
//	/********************************
//		アクションイベントの設定
//	********************************/
//		public void actionPerformed(ActionEvent e){
//			selectedCheckbox = chkboxGroup.getSelectedCheckbox();
//
//			if (selectedCheckbox == lowlevel){
//				maxYear	  = 50;
//				maxEnergy	= 6000;
//				maxPhotonTor = 20;
//				level		= 3;
//			}
//			else if (selectedCheckbox == middlelevel){
//				maxYear	  = 40;
//				maxEnergy	= 5000;
//				maxPhotonTor = 15;
//				level		= 2;
//			}
//			else{
//				maxYear	  = 30;
//				maxEnergy	= 4000;
//				maxPhotonTor = 10;
//				level		= 1;
//			}
//
//			iStatus.initial();
//			dSector.develop();
//
//			hide();
//			return ;
//		}
//	}


/****************************
	ゲーム終了のチェック
****************************/

	Game_msg1 : "",
	Game_msg2 : null,


	/**************************
		負けの判定メソッド
	***************************/
		Game_isGameOver : function(){
			if ( (this.curEnergy > 0) && (this.leftYear > 0) ){
					return;
			}
			else if ( this.curEnergy <= 0 ){
				this.Game_msg1 = "エネルギーが無くなった !!, 負け";
			}
			else if ( this.leftYear <= 0 ){
				this.Game_msg1 = "寿命がつきた !!, 負け";
			}

//			msg2 = "続けますか ？";
//			okngStatus = 0;
//			okngDialog.disp( msg1,msg2);
//			if ( okngStatus == 1 )
//			{
//				dispose();				// ウインドウを閉じる
//				System.gc();
//				contFlag = 1;
//				StarTrek s = new StarTrek();
//				s.init();
////				s.show();
//			}
//			else{
//				dispose();				// ウインドウを閉じる
//				System.exit(0);		 // アプリケーションを終了させる
//			}
			return;
		},

	/**************************
		勝ちの判定メソッド
	***************************/
		Game_isGameWin : function(){
			if (this.allKlingon <= 0 ){
				msg1 = "クリンゴンが全て消滅 !!,  勝利";
				msg2 = "続けますか ？";

//				okngStatus = 0;
//				okngDialog.disp( msg1,msg2);
//				if ( okngStatus == 1 )
//				{
////					dispose();				// ウインドウを閉じる
//					System.gc();
//					contFlag = 1;
//					StarTrek s = new StarTrek();
//					s.init();
////					s.show();
//				}
//				else{
//					dispose();				// ウインドウを閉じる
//					System.exit(0);		 // アプリケーションを終了させる
//					return;
//				}
			}
			else{
				return;
			}
		},

///**********************
//	メニューバー
//***********************/
//	public class menuBar extends MenuBar{
//
//		public menuBar(){
//			super();					 //上位クラス(Panel) のコンストラクタの呼び出し
//
//		 	Menu filemenu = new Menu("ゲーム");
//			filemenu.add( new menuItem("レベル設定"));
//			filemenu.addSeparator();
//			filemenu.add( new menuItem("終了"));
//			add(filemenu);
//
//		 	Menu helpmenu = new Menu("ヘルプ");
//			helpmenu.add( new menuItem("ヘルプ"));
//			helpmenu.add( new menuItem("ReadMe"));
//			helpmenu.addSeparator();
//			helpmenu.add(new menuItem("バージョン情報"));
//			add(helpmenu);
//
//			setMenuBar(this);
//		}
//	}


///****************************************
//	メニューアクションイベントの設定
//****************************************/
//	public class menuItem extends MenuItem implements ActionListener{
//		public menuItem(String op)	{
//			super(op);
//			addActionListener(this);
//		}
//
//
//	/********************************
//		アクションイベントの設定
//	********************************/
//		public void actionPerformed(ActionEvent e)	{
//			menuItem = getLabel();
//			if ("レベル設定".equals(menuItem))
//				lvlDialog.disp();	   // レベル設定ダイアログの表示
//			else if	("終了".equals(menuItem)){
//				dispose();				// ウインドウを閉じる
//				System.exit(0);		 // アプリケーションを終了させる
//			}
//			else if	("ヘルプ".equals(menuItem)){
//				hlpWindow.disp();		 // ヘルプ ウィンドウの表示
//			}
//			else if	("ReadMe".equals(menuItem)){
//				msgWindow.disp();		 // ヘルプ ウィンドウの表示
//			}
//			else if	("バージョン情報".equals(menuItem)){
//				verDialog.disp();		 // バージョン情報ダイアログの表示
//			}
//			else{
//				return ;
//			}
//		}
//	}


///*********************************
//	バージョン情報のダイアログ
//**********************************/
//	public class versionDialog extends Dialog implements ActionListener,WindowListener{
//		Button okButton;
//
//		public versionDialog(Frame parent)	{
//			super(parent, "バージョン情報", true);
//
//			GridBagLayout	  dialogLayout = new GridBagLayout();
//			GridBagConstraints dialogCnst   = new GridBagConstraints();
//			setLayout(dialogLayout);
//
//			Label version = new Label( "バージョン	   0.90" );   //   1列
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(version, dialogCnst);
//			add( version );
//
//			Label date = new Label( "		   2003 / 08 / 08" );	   //   2列
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(date, dialogCnst);
//			add( date );
//
//			Label spLabel = new Label("   ");						//   スペースの追加
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(spLabel, dialogCnst);
//			add(spLabel);
//
//			okButton = new Button("OK");							 //   4列
//			okButton.addActionListener(this);
//			dialogCnst.gridwidth = GridBagConstraints.REMAINDER;
//			dialogLayout.setConstraints(okButton, dialogCnst);
//			add( okButton );
//		}
//
//
//	/**********************************************
//		バージョン情報ダイアログの表示メソッド
//	***********************************************/
//		public void disp()	{
//			setSize(200,150);
//			setLocation(100, 100);
//			show();
//		}
//
//
//	/*******************************
//		Windows イベントの設定
//	*******************************/
//		public void windowClosing(WindowEvent e){
//			hide();
//		}
//		public void windowOpened(WindowEvent e){}
//		public void windowClosed(WindowEvent e){
//			hide();
//		}
//		public void windowIconified(WindowEvent e){}
//		public void windowDeiconified(WindowEvent e){}
//		public void windowActivated(WindowEvent e){}
//		public void windowDeactivated(WindowEvent e){}
//
//	/*******************************
//		アクションイベントの設定
//	*******************************/
//		public void actionPerformed(ActionEvent e){
//			hide();
//			return ;
//		}
//	}


///*********************************
//	Text表示用Ｗｉｎｄｏｗ
//**********************************/
//	public class textWindow extends Frame implements ActionListener,WindowListener{
//		TextArea textArea;
//
//		public textWindow( String title, String file)	{
//			super(title);
//
//			FileReader fReader = null;
//			BufferedReader bReader = null;
//			String str = null;
//
//			textArea = new TextArea();
//			textArea.setEditable( false );			  // 書き込み禁止
//			Color textAreaColor = new Color( 0xffffff );
//			textArea.setBackground(textAreaColor);
//			add(textArea);
//
//			try{
//				fReader = new FileReader( file );
//				bReader = new BufferedReader(fReader);
//			}catch(IOException e){
//			}
//
//			do{
//				try{
//					str = bReader.readLine();
//					if ( str != null ){
//						textArea.append( str );
//						textArea.append( "\n" );
//					}
//				}catch(IOException e){
//				}
//			}while(str != null);
//
//			try{
//				bReader.close();
//				fReader.close();
//			}catch(IOException e){
//			}
//		}
//
//
//	/**************************************
//		Text用ウィンドウの表示メソッド
//	***************************************/
//		public void disp()	{
//			setSize(650,500);
//			setLocation(50, 10);
//			addWindowListener(this);
//			show();
//		}
//
//
//	/******************************
//		Windows イベントの設定
//	******************************/
//		public void windowClosing(WindowEvent e){
//			hide();
//			return ;
//		}
//		public void windowOpened(WindowEvent e){}
//		public void windowClosed(WindowEvent e){}
//		public void windowIconified(WindowEvent e){}
//		public void windowDeiconified(WindowEvent e){}
//		public void windowActivated(WindowEvent e){}
//		public void windowDeactivated(WindowEvent e){}
//
//
//	/******************************
//		アクションイベントの設定
//	******************************/
//		public void actionPerformed(ActionEvent e){
//			hide();
//			return ;
//		}
//	}

	};

	for(let i=0; i<8; i++) {
		starTrek.srPanel[i] = [];
		starTrek.gmPanel[i] = [];
		for(let j=0; j<8; j++) {
			starTrek.srPanel[i][j] = 0;
			starTrek.gmPanel[i][j] = 0;
		}
	}
	for(let i=0; i<9; i++) {
		starTrek.q[i] = [];
		starTrek.s[i] = [];
		for(let j=0; j<9; j++) {
			starTrek.q[i][j] = 0;
			starTrek.s[i][j] = 0;
		}
	}
	return starTrek;
}

const plugin = function(g) {
	g = 3 - parseInt(g / 10)
	if(g <= 0) g = 1;
	let i = StarTrek();
	i.init(g);
	return i;
};

module.exports = { plugin };
