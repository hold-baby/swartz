var os = require('os');

var ip;

ifaces = os.networkInterfaces();

ifaces['以太网'].forEach(function(item){
	if(item.family === 'IPv4'){
		ip = item.address;
	}
})

module.exports = ip;