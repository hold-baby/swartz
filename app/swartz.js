const path = require('path');

const _ = require('../lib/util.js');
const webServer = require('../app/webServer.js');
const uploadServer = require('../app/uploadServer');
const pushServer = require('../app/pushServer');

function checkObj(obj){
	if(!obj.port){
		console.log('服务缺少端口')
		return false
	}else if(!obj.path){
		obj.path = './';
	}

	return true
}

function swartz(){
	this.serverQueue = [];
	
	this.staticServer = function(obj){
		if(!checkObj(obj)){
			return
		}
		_.probe(obj.port).then(() => {
			this.serverQueue.push(webServer(obj));
		}, function(err){
			console.log(obj.port + '端口被占用')			
		})
	};
	this.webServer = this.staticServer;

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