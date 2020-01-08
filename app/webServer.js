const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const https = require('https');
const ip = require('../lib/ip');
const colors = require('colors');
const history = require('connect-history-api-fallback');

const _ = require('../lib/util.js');

process.on('message', function(obj){
    webServer(obj)
});

/**
 * 前端静态资源服务
 */
function webServer(obj){
	let webApp = express();
	const httpServer = http.createServer(webApp);
	let isHttps = true; // 是否启用https服务
	let httpsServer; // 定义https服务变量

	let _this = this;

	// 判断配置是否有https字段
	if(!!obj.https){
		// https服务必有字段检查
		let https_key = ['port', 'key', 'cert'];
		https_key.forEach((item) => {
			if(!obj.https[item]){
				isHttps = false;
			}
		})
	}else{
		isHttps = false;
	}

	if(isHttps){
		// 启动https服务并导入证书
		httpsServer = https.createServer({
			key : fs.readFileSync(obj.https.key),
			cert : fs.readFileSync(obj.https.cert)
		},webApp);

		// 当只启用https时,http服务重定向至https服务
		function goHttps(req, res, next){
		    
		    if(req.protocol === 'http') {
		        let host = req.headers.host;

		        https_port = ':' + obj.https.port;
		        host = host.replace(/\:\d+$/, https_port);
		        var url = `https://${host}${req.path}`;
		        res.redirect(307, url);
		    }else{
		        next()
		    }
		}
	}

	try{
		// 使用命令行目录作为web服务地址
		const serverAddr = path.resolve(process.cwd(), obj.path); // 获取当前命令行目录

		if(obj.history && typeof obj.history === 'boolean'){
			webApp.use(history())
		};

		if(isHttps){
			obj.https.only && webApp.use('*', goHttps)
		}

		webApp.use('/', express.static(serverAddr));
		httpServer.listen(obj.port, () => {
			console.log("web server is open at ")
			console.log(`${ip.getIP()}:${obj.port}`.yellow)
			console.log(`${ip.getIP4()}:${obj.port}`.yellow)
			_this.isCMD ? _.sendMsg(process, {
	            des : '服务启动成功',
	            type : 'start'
	        }) : false
		})

		if(isHttps){
			httpsServer.listen(obj.https.port, () => {
				console.log("https server is open at ")
				console.log(`${ip.getIP()}:${obj.https.port}`.yellow)
				console.log(`${ip.getIP4()}:${obj.https.port}`.yellow)
				_this.isCMD ? _.sendMsg(process, {
		            des : '服务启动成功',
		            type : 'start'
		        }) : false
			})
		}
	}catch(e){
		console.log(e)
        _this.isCMD ? _.sendMsg(process, {
            des : e,
            type : 'close'
        }) : false
	}

	
	return webApp
};

module.exports = webServer;