/*
 * Created on 2004/12/22
 *
 */
//import java.awt.*;

/**
 * 盤面を1手戻すための情報をまとめたクラス。
 * 
 * @author mori
 *
 */
const Undo = function(x, y) {
	let undo = _Undo_();
	undo.x = x;
	undo.y = y;
	undo.count = 0;
	undo.pos = [];
	for(let i=0; i<64; i++)
		undo.pos[i] = null;
	return undo;
}
const _Undo_ = function() {
	return {

	// 石を打つ場所
	x : -1,
	y : -1,
	// ひっくり返った石の数
	count : -1,
	// ひっくり返った石の場所
	/*Point[]*/ pos : null

	};
}

module.exports = { Undo };
