const npmYuan = require("npm-yuan")
const ip = require('./ip');
const colors = require('colors');

var getInfoFn = function(args){
	switch(args[0]){
		case "yuan":
			npmYuan.show()
			break;
		case "ip":
			console.log(ip.getIP4().yellow)
			break;
		case "ipv6":
			console.log(ip.getIP6().yellow)
			break;
		case "path":
			console.log(process.cwd())
			break;
		
	}
}

module.exports = getInfoFn