const MouseEvent  = function() {
	let me = _MouseEvent_();
	return me;
}

const _MouseEvent_ = function() {
	return {
	x : 0,
	y : 0,
	getX : function() {
		return this.x;
	},
	getY : function() {
		return this.y;
	}
	};
}

module.exports = { MouseEvent };
