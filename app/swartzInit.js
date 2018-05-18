const fs = require('fs');
const path = require('path');
const pkg = require('../package.json')

/**
 * swartz init
 * 自动生成sw-config.js配置文件
 */
function swartzInit(){

	// 配置文件名
	const fileName = "sw-config.js";
	// 读取配置模版文件
	const sourceFile = path.resolve(__dirname, '../public/temp/swartz-config-temp.js');

	// 生成文件
	const destPath = path.join(process.cwd(), fileName);
	
	// 写入内容
	fs.readFile(sourceFile, 'utf-8', function(err, data){
		if(err){
			console.log(err)
			return
		};
		var result = data.replace('version', 'v' + pkg.version)

		fs.writeFile(destPath, result, 'utf8', function(){
			if(err){
				console.log(err)
				return
			};

		})
	});
};

module.exports = swartzInit;