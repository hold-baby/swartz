const os = require('os');
const net = require('net');

/**
 * 获取本机区域网ip
 */
function getIP (){
	let ip;

	ifaces = os.networkInterfaces();

	ifaces['以太网'].forEach(function(item){
		if(item.family === 'IPv4'){
			ip = item.address;
		}
	})

	return ip;
}

/**
 * 检查端口是否被占用
 * @		numb
 * return	Promise
 */ 
 function probe(port) {

    let ps = new Promise(function(resolve, reject){
    	let server = net.createServer().listen(port)
    	server.on('listening', function() {
	        if (server){
	            server.close()
	        }
	        resolve()
	    })
	    server.on('error', function(err) {
	        let result = true
	        if (err.code === 'EADDRINUSE'){
	            reject(err)
	        }else{

	        }
	        
	    })
    })

    return ps
}

module.exports = {
	getIP : getIP,
	probe : probe
}