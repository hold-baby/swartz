#!/usr/bin/env node

let program = require('commander');
let colors = require('colors');

let pkg = require('../package.json');

/**
 * Module dependencies.
 */
program
.usage("swartz")
// .version(config.version, '-v, --version', pkg.version)
.option('server', '服务端命令')
.option('start', 'web服务启动')
.option('push', '资源上传')
.option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
.parse(process.argv);


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

if (program.start) {
	console.log('web服务启动')
}

if (program.push) {
	console.log('启动上传')
}