const path = require('path');

const _ = require('../lib/util.js');
const webServer = require('../app/webServer.js');
const staticServer = require('../app/staticServer.js');
const uploadServer = require('../app/uploadServer');
const pushServer = require('../app/pushServer');
const swartzInit = require('../app/swartzInit');

// swartz类
function swartz(){
	this.serverQueue = [];
	// 前端页面服务
	this.webServer = (obj) => {
		if(!checkObj(obj)){
			return
		}
		_.probe(obj.port).then(() => {
			this.serverQueue.push(webServer(obj));
		})
	};
	// 静态资源服务
	this.staticServer = (obj) => {
		if(!checkObj(obj)){
			return
		}
		_.probe(obj.port).then(() => {
			this.serverQueue.push(staticServer(obj));
		})
	};
	// 接收服务
	this.uploadServer = (obj) => {
		_.probe(obj.port).then(() => {
			uploadServer(obj)
		})
	};
	// 上传服务
	this.pushServer = (obj) => {
		pushServer(obj)
	};
	// 获取配置任务
	this.taskList = [];
	this.task = (task, fn) => {
		this.taskList.push({
			taskName : task,
			fn : fn
		});
	};
	this.swartzInit = swartzInit;
};

// 检查是否有端口参数
function checkObj(obj){
	if(!obj.port){
		console.log('服务缺少端口')
		return false
	}

	return true
};


module.exports = new swartz()