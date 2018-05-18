let path = require('path');
let express = require('express');
let history = require('connect-history-api-fallback');

const _ = require('../lib/util.js');

process.on('message', function(obj){
    webServer(obj)
});

/**
 * 前端静态资源服务
 */
function webServer(obj){
	let webApp = express();

	try{
		// 使用命令行目录作为web服务地址
		const serverAddr = path.resolve(process.cwd(), obj.path); // 获取当前命令行目录

		if(obj.history && typeof obj.history === 'boolean'){
			webApp.use(history())
		};

		webApp.use('/', express.static(serverAddr));
		webApp.listen(obj.port, () => {
			console.log("web server is open at " + _.getIP() + ':' + obj.port)
			_.sendMsg(process, {
	            des : '服务启动成功',
	            type : 'start'
	        })
		})
	}catch(e){
		console.log(e)
        _.sendMsg(process, {
            des : e,
            type : 'close'
        })
	}

	
	return webApp
};

module.exports = webServer;