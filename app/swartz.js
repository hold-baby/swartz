const path = require('path');

const _ = require('../lib/util.js');
const webServer = require('../app/webServer.js');
const staticServer = require('../app/staticServer.js');
const uploadServer = require('../app/uploadServer');
const pushServer = require('../app/pushServer');

function checkObj(obj){
	if(!obj.port){
		console.log('服务缺少端口')
		return false
	}

	return true
}

function swartz(){
	this.serverQueue = [];
	
	this.webServer = function(obj){
		if(!checkObj(obj)){
			return
		}
		_.probe(obj.port).then(() => {
			this.serverQueue.push(webServer(obj));
		}, function(err){
			console.log(obj.port + '端口被占用')			
		})
	};
	this.staticServer = function(obj){
		if(!checkObj(obj)){
			return
		}
		_.probe(obj.port).then(() => {
			this.serverQueue.push(staticServer(obj));
		}, function(err){
			console.log(obj.port + '端口被占用')			
		})
	};

	this.uploadServer = function(obj){
		_.probe(obj.port).then(() => {
			uploadServer(obj)
		}, function(err){
			console.log(obj.port + '端口被占用')	
		})
	};

	this.pushServer = function(obj){
		pushServer(obj)
	};

	this.taskList = [];
	this.task = function(task, fn){
		this.taskList.push({
			taskName : task,
			fn : fn
		});
	}

}


module.exports = new swartz()