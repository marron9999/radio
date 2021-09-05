/*
 * Created on 2004/12/23
 *
 */

/**
 * 盤面の石の数を数えるのに使う
 * 
 * @author mori
 *
 */
const Counter = function() {
	let counter = _Counter_();
	counter.blackCount = 0;
	counter.whiteCount = 0;
	return counter;
}

const _Counter_ = function() {
	return {

	blackCount : 0,
	whiteCount : 0

	};
}

module.exports = { Counter };
