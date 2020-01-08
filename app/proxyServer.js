const path = require('path');
const express = require('express');
const colors = require('colors');
const proxy = require('http-proxy-middleware')
const ip = require('../lib/ip');

const _ = require('../lib/util.js');

process.on('message', function(obj){
    proxyServer(obj)
});

/**
 * 前端静态资源服务
 */
function proxyServer(obj){
	let proxyApp = express();

	let _this = this;

	const allowHeader = "Origin, X-Requested-With, Content-Type, Accept, X-File-Name, Authorization"
	const contentType = "application/json;charset=utf-8"
	
	function setHeader (df, header){
		return header ? df + ", " + header : df
	}

	try{

		proxyApp.use("*", function(req, res, next){
			res.header("Access-Control-Allow-Headers", setHeader(allowHeader, obj.allHeader));  
			res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
		    res.header("X-Powered-By",' 3.2.1');
		    res.header("Content-Type", setHeader(contentType, obj.contentType)); 
		    res.header("Access-Control-Allow-Origin", '*');
		    res.header('Access-Control-Allow-Credentials', 'true');
		 	next();
		})

		proxyApp.use('/', proxy(obj.options))
		
		proxyApp.listen(obj.port, () => {
			console.log("proxy server is open at ")
			console.log(`${ip.getIP()}:${obj.port}`.yellow)
			console.log(`${ip.getIP4()}:${obj.port}`.yellow)
			_this.isCMD ? _.sendMsg(process, {
                des : '服务启动成功',
                type : 'start'
            }) : false
		})
	}catch(e){
		console.log(e)
        _this.isCMD ? _.sendMsg(process, {
            des : e,
            type : 'close'
        }) : false
	}
	
	return proxyApp
};

module.exports = proxyServer;