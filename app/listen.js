const child_process = require('child_process');
const fork = child_process.fork;

function Listen(path, obj){

	this.path = path;
	this.obj = obj;
	this.app = null;
	this.id = null;
	this.restartCount = null;

	this.start();
};

Listen.prototype.start = function(){
	this.app = fork(this.path);
	this.app.on('message', (msg) => {
		switch(msg.type){
			case 'close':
				console.log(msg)
				this.restart()
				break;
			case 'start':
				this.restartCount = 0;
				break;
		}
	});
	this.app.send(this.obj);

	if(!this.id){
		this.createID();
	}
};
Listen.prototype.restart = function(){
	if(this.restartCount === null){
		return
	}

	this.restartCount++;

	if(this.restartCount < 4){

		this.start()

	}else{
		console.log('连续重启失败，请检查代码')
	}
}
Listen.prototype.switch = function(msg){
	switch(msg.type){
		case 'close':
			this.start()
			break;
		case 'info':
			console.log(msg)
			break;
	}
};
Listen.prototype.createID = function(){
	var num = String(parseInt(Math.random() * 10000));
	var day = new Date().getTime().toString();
	this.id = day + num;
};
Listen.prototype.getID = function(){
	return this.id;
};

module.exports = Listen