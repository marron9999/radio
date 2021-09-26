const fs = require('fs');
const maze = require('./maze/maze-big.js');

let i = maze.plugin(0);

console.log("maze-big: Start generate");
i.gen(1000 * 2 + 1, 1000 * 2 + 1, null,
	function(m) {
		console.log("Remain " + m.xyc);
	});
console.log("maze-big: Generated!!! ");

let json = JSON.stringify(i);
//console.log(json);
try {
	fs.writeFileSync("./maze/maze-big.json",json);
} catch (err) {
	console.log(err);
}
