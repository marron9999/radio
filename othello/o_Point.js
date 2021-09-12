const Point = function(x, y) {
	const point = _Point_();
	point.x = x;
	point.y = y;
	return point;
}

const _Point_ = function() {
	return {
	x : 0,
	y : 0
	};
}

module.exports = { Point };
