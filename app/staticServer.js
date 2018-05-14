let path = require('path');
let express = require('express');

const _ = require('../lib/util.js');

/**
 * 前端静态资源服务
 */
module.exports = function webServer(obj){
	let static = express();

	if(!!obj.path){
		// 使用命令行目录作为web服务地址
		const serverAddr = path.resolve(process.cwd(), obj.path); // 获取当前命令行目录

		static.use('/', express.static(serverAddr));
	}else{
		// path和router不能同时存在
		// 有path则router不生效
		if(!!obj.router && Object.keys(obj.router).length !== 0){
			for(var i in obj.router){
				static.use(i, express.static(__dirname + obj.router[i]));
			}
		}
	}

	static.listen(obj.port, function(){
		console.log("web server is open at " + _.getIP() + ':' + obj.port)
	})
	
	return static
}