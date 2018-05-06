const net = require('net');

function probe(port, callback) {

    var ps = new Promise(function(resolve, reject){
    	var server = net.createServer().listen(port)
    	server.on('listening', function() {
	        if (server){
	            server.close()
	        }
	        resolve()
	    })
	    server.on('error', function(err) {
	        var result = true
	        if (err.code === 'EADDRINUSE'){
	            reject(err)
	        }else{

	        }
	        
	    })
    })
    return ps
    // ps.then(function(res){
    // 	callback(true)
    // }, function(err){

    // })
}

module.exports = probe;