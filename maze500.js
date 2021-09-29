const fs = require('fs');
const maze = require('./maze/maze-big.js');

let m = 500;

let i = maze.plugin(-1);

console.log("maze-big: Start generate");
i.gen(m * 2 + 1, m * 2 + 1, null,
	function(m) {
		console.log("Remain " + m.xyc + " : +" + m.xyc_a + ", -" + m.xyc_d);
	});
console.log("maze-big: Generated!!! ");

let json = JSON.stringify(i);
//console.log(json);
try {
	fs.writeFileSync("./maze/maze" + m + ".json",json);
} catch (err) {
	console.log(err);
}
