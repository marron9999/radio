const fs = require('fs');
const path = require('path');
const moment = require('moment');
const {exec} = require('child_process')
const request = require('request');

const log = require('./log.js').log;

const post = {
	posts: function() {
		return {
			post : function(req, res) {
				//log.info("", "post - req: " + JSON.stringify(req.headers));
				//log.info("", "post - start");
				if(req.headers.connection == "close") {
					post_(req.body, res);
					return;
				}
				var body = "";
				req.on('error', function(error) {
					log.error("", "post - error:" + error);
				});
				req.on('data', function(chunk) {
					//log.info("", "post - data");
					body += chunk;
				});
				req.on('end', function() {
					//log.info("", "post - end");
					post_(body, res);
				});
			},
			load: function(req, res) {
				let id = decodeURIComponent(req.body);
				log.info("", "load:" + id);
				let body = encodeURIComponent(log.load(id, "txt"));
				res.send(body);
			},
			log: function(req, res) {
				let id = decodeURIComponent(req.body);
				log.info("", "log:" + id);
				let body = encodeURIComponent(log.load(id, "log"));
				res.send(body);
			},
			dir: function(req, res) {
				let ls = fs.readdirSync(ROOT);
				log.info("", "dir:" + ROOT);
				let body = "";
				ls.forEach(file => {
					if (path.extname(file) == ".txt") {
						let d = fs.statSync(ROOT + "/" + file);
						let r = fs.readFileSync(ROOT + "/" + file);
						d = moment(d.mtime).format("YYYY/MM/DD HH:mm:ss.SSS");
						r = "" + r;
						if(r != "") {
							r = r.split("\n");
							if(r[r.length - 1] == "")
								r = r[r.length - 2];
							else r = r[r.length - 1];
							let p = r.indexOf("\t");
							r = r.substr(p+1);
							p = r.indexOf("\t");
							r = r.substr(p+1);
						}
						body += path.basename(file) + "\t" + d + "\t" + r + "\n";
					}
				});
				body = encodeURIComponent(body);
				res.send(body);
			}
		};
	}
};

function post_(body, res) {
	body = decodeURIComponent(body);
	log.info("", "post:" + body);
	let p = body.indexOf("\t");
	let id = body.substr(0, p);
	body = body.substr(p + 1);
	log.store(id, "txt", body);
	let body2 = encodeURIComponent(log.load(id, "txt"));
	res.send(body2);
	let config = require('./config.js').load();
	if(config.post != undefined) {
		log.info("", "slack:" + body);
		p = body.indexOf("\t");
		slack(config.post.slack,
			date + " /" + path + " " + body.substr(0, p) + "\n"
			+ body.substr(p+1)
		);
	}
}

function slack(uri, text) {
	request.post({
		uri: uri,
		headers: {"Content-Type": "application/json"},
		json: {text: text}
	}, function(error, res, body) {
		if(error != null) {
			log.error("", "slack:" + error.message);
		}
		log.info("", 'slack.status:' + res.statusCode);
		log.info("", 'slack.headers:' + JSON.stringify(res.headers));
	});
}

module.exports = { post };
