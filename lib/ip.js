const address = require('address');

var getIP4 = function(){
	return address.ip()
}

var getIP6 = function(){
	return address.ipv6()
}

var getIP = function(){
	return address.ip("lo")
}

module.exports = {
	getIP4: getIP4,
	getIP6: getIP6,
	getIP: getIP,
}