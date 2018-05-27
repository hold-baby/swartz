#!/usr/bin/env node

let program = require('commander');
const colors = require('colors');
const path = require('path');
const fs = require('fs');

const pkg = require('../package.json');
const cfg = require('../lib/config.js');
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
	// 读取配置文件
	const cfgFile = process.cwd() + '/sw-config.js';
	fs.exists(cfgFile, function(exists){
		if(exists){
			const sw = fs.readFileSync(cfgFile,"utf-8");
			var reg = /require\((\.*?)[^)]*?\)/g;

			var requireLIst = sw.match(reg);
			var requireMap = {};
			requireLIst = requireLIst.map((item) => {
				var key = item;
				requireMap[key] = '';
				item = item.replace('require(', "");
				item = item.replace(')', "");
				item = item.replace(/\"|'/g, "");
				requireMap[key] = item;
				return item
			})
			for(let i in requireMap){
				fs.exists(path.join(process.cwd(),requireMap[i]), (exists) => {
					if(exists){
						console.log(requireMap[i] + '存在');
					}else{
						console.log(requireMap[i] + '不存在');
					}
				})
			};
			return
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
};