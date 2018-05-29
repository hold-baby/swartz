#!/usr/bin/env node

let program = require('commander');
const colors = require('colors');
const path = require('path');
const fs = require('fs');

const pkg = require('../package.json');
const cfg = require('../lib/config.js');
const swFix = require('../lib/swFix.js');
const swartz = require('../app/swartz.js');

/**
 * Module dependencies.
 */
program
.usage("swartz")
.version(cfg.info, '-v, --version', pkg.version)
.option('init', '初始化')
.parse(process.argv);

// 命令行参数
const args = program.args;

if(program.init){
	swartz.swartzInit();
}else{
	// 配置文件路径
	const cfgFile = process.cwd() + '/sw-config.js';
	fs.exists(cfgFile, function(exists){
		if(exists){
			// 读取配置文件
			let sw = fs.readFileSync(cfgFile,"utf-8");
			
			// 过滤配置文件中的非文件注入
			sw = swFix(sw);
			// 执行配置文件内容
			eval(sw);
			// 执行task
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
};