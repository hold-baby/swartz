let path = require('path');
let express = require('express');

const _ = require('../lib/util.js');

process.on('message', function(obj){
    staticServer(obj)
});

/**
 * 前端静态资源服务
 */
function staticServer(obj){
	let static = express();

	try{

		static.use('*', _.corsStatic);

		if(!!obj.path){
			// 使用命令行目录作为web服务地址
			const serverAddr = path.resolve(process.cwd(), obj.path); // 获取当前命令行目录

			static.use('/', express.static(serverAddr));
		}else{
			// path和router不能同时存在
			// 有path则router不生效
			if(!!obj.router && Object.keys(obj.router).length !== 0){
				for(let i in obj.router){
					static.use(i, express.static(process.cwd() + obj.router[i]));
				}
			}
		}

		static.listen(obj.port, () => {
			console.log("static server is open at " + _.getIP() + ':' + obj.port)
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
	
	return static
};

module.exports = staticServer;