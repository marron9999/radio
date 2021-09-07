let trace = 1;
	// 3: error
	// 2: warn
	// 1: info

const log = {
	info: function(text) { if(trace <= 1) console.log(text); },
	warn: function(text) { if(trace <= 2) console.log(text); },
	error: function(text) { if(trace <= 3) console.log(text); },
	set: function(level) { trace = level; }
};

module.exports = { log };
