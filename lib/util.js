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
	// 检测端口
    let ps = new Promise((resolve, reject) => {
    	let server = net.createServer().listen(port)
    	server.on('listening', () => {
	        if (server){
	            server.close()
	        }
	        resolve()
	    })
	    server.on('error', (err) => {
	        let result = true
	        if (err.code === 'EADDRINUSE'){
	            reject(err)
	        }else{

	        }
	        
	    })
    });
    // 捕获错误
    ps.catch((err) => {
    	console.log(port + '端口被占用')	
    })

    return ps
}

/**
 * 跨域中间件
 */
function cors(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-File-Name");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("Content-Type", "application/json;charset=utf-8"); 
    res.header("X-Powered-By",' 3.2.1');
    res.header("Cache-Control","no-store"); 
    if(req.method == 'OPTIONS'){
        res.sendStatus(200).end();  //让options请求快速返回/
    }else{
        next();
    }
}

/**
 * 静态资源跨域中间件
 */
function corsStatic(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-File-Name");  
    res.header("Cache-Control","no-store"); 
    if(req.method == 'OPTIONS'){
        res.sendStatus(200).end();  //让options请求快速返回/
    }else{
        next();
    }
}

module.exports = {
	getIP : getIP,
	probe : probe,
	cors : cors,
	corsStatic : corsStatic
}