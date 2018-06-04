#!/usr/bin/env node

let program = require('commander');
const Liftoff = require('liftoff');

const colors = require('colors');
const path = require('path');
const fs = require('fs');

const pkg = require('../package.json');
const cfg = require('../lib/config.js');

const cli = new Liftoff({
	name : 'swartz',
	configName: 'sw-config',

	// 只支持js文件
	extensions: {
	'.js': null
	}
})

cli.launch({
}, function(env){
	
	let swartz;
	swartz = require('../app/swartz.js');

	Object.defineProperty(global, 'swartz', {
	  enumerable: true,
	  writable: false,
	  value: swartz
	});

	/**
	 * 命令任务
	 */
	program
	.version(cfg.info, '-v, --version', pkg.version)
	.option('init', '初始化')
	.parse(process.argv);

	// 命令行参数
	const args = program.args;

	if(program.init){
		swartz.swartzInit();
	}else{
		// 配置文件路径
		if(env.configPath){
		    try{
		    	require(env.configPath)
				// 执行task
				args.forEach(function(item){
					swartz.taskList.map(function(task){
						if(task.taskName == item){
							task.fn()
						}
					})
				});
		    }catch(e){
		    	console.log('未找到'.red + env.configPath)
			}
		}
	};
})

