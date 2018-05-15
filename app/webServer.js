let path = require('path');
let express = require('express');
let history = require('connect-history-api-fallback');

const _ = require('../lib/util.js');

/**
 * 前端静态资源服务
 */
module.exports = function webServer(obj){
	let webApp = express();

	// 使用命令行目录作为web服务地址
	const serverAddr = path.resolve(process.cwd(), obj.path); // 获取当前命令行目录

	if(obj.history && typeof obj.history === 'boolean'){
		webApp.use(history())
	};

	// webApp.use('/', _.cors);
	webApp.use('/', express.static(serverAddr));
	webApp.listen(obj.port, function(){
		console.log("web server is open at " + _.getIP() + ':' + obj.port)
	})
	
	return webApp
}