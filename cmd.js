const fs = require('fs');
const {exec} = require('child_process')

const config = require('./config.js').load();

const cmd = {
	posts: function() {
		return {
			cmd: function(req, res) {
				let cmd = decodeURIComponent(req.body);
				exec(cmd, (error, stdout, stderr) => {
					let output = {stdout:stdout, stderr:stderr};
					if (error) output = error;
					output = JSON.stringify(output);
					output = encodeURIComponent(output);
					res.send(output);
					return;
				});
			},
		};
	}
};

function slack(uri, text) {
	if(uri == undefined || uri == null) return;
	if(text == undefined || text == null) return;
	request.post({
		uri: uri,
		headers: {"Content-Type": "application/json"},
		json: {text: text}
	}, function(error, res, body) {
		if(error != null) {
			//console.log('slack:' + error.message);
		}
	});
	//console.log('status:' + res.statusCode);
	//console.log('headers:' + JSON.stringify(res.headers));
}

module.exports = { cmd };
