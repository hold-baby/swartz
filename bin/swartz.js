#!/usr/bin/env node

let program = require('commander');
let colors = require('colors');
const fs = require('fs');

let pkg = require('../package.json');
const swartz = require('../app/swartz.js');

/**
 * Module dependencies.
 */
program
.usage("swartz")
.version(pkg.version, '-v, --version')
.option('server', '服务端命令')
.option('s, tart', 'web服务启动')
.option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
.parse(process.argv);

// 命令行参数
var args = program.args;

if (program.server) {
	switch(args[0]){
		case 'init':
			console.log('init')
			break;
		default:
			console.log('请使用正确的命令'.red);
	}
}
// 读取配置文件
const cfgFile = process.cwd() + '/sw-config.js';
fs.exists(cfgFile, function(exists){
	if(exists){
		const sw = fs.readFileSync(cfgFile,"utf-8");
		eval(sw);

		args.forEach(function(item){
			swartz.taskList.map(function(task){
				if(task.taskName == item){
					task.fn()
				}
			})
		});
	}else{
		console.log('未找到'.red + cfgFile)
	}
});
