const fs = require('fs');

const log = require('./log.js').log;

let config = {};

const load = function(file) {
	if(file == undefined || file == null) {
		return config;
	}
	try {
		let c = fs.readFileSync(file);
		log.info("", "config.load:" + file);
		config = JSON.parse(c);
	} catch(error) {
		log.error("", "config.load:" + error);
	}
	return config;
};

module.exports = { load };
