const path = require('path');

const _ = require('../lib/util');
const webServer = require('../app/webServer');
const staticServer = require('../app/staticServer');
const uploadServer = require('../app/uploadServer');
const pushServer = require('../app/pushServer');
const swartzInit = require('../app/swartzInit');
const Listen = require('../app/listen');

// swartz类
function swartz(){
	this.serverList = {};
	// 前端页面服务
	this.webServer = (obj) => {
		if(!checkObj(obj)){
			return
		}
		_.probe(obj.port).then(() => {
			this.createChild('/webServer.js', obj)
		})
	};
	// 静态资源服务
	this.staticServer = (obj) => {
		if(!checkObj(obj)){
			return
		}
		_.probe(obj.port).then(() => {
			this.createChild('/staticServer.js', obj)
		})
	};
	// 接收服务
	this.uploadServer = (obj) => {
		_.probe(obj.port).then(() => {
			// uploadServer(obj)
			this.createChild('/uploadServer.js', obj)
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
	// 初始化配置文件
	this.swartzInit = swartzInit;
	// 创建子进程
	this.createChild = function(path, obj){
		var app = new Listen(__dirname + path, obj)
		if(app.getID){
			this.serverList[app.getID] = app;
		}
	};
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