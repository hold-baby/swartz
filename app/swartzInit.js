const fs = require('fs');
const path = require('path');

/**
 * swartz init
 * 自动生成sw-config.js配置文件
 */
function swartzInit(){

	// 配置文件名
	const fileName = "sw-config.js";
	// 读取配置模版文件
	const sourceFile = path.resolve(__dirname, '../public/temp/swartz-config-temp.js');
	const readStream = fs.createReadStream(sourceFile);

	// 生成文件
	const destPath = path.join(process.cwd(), fileName);
	const writeStream = fs.createWriteStream(destPath);
	
	// 写入内容
	readStream.pipe(writeStream);

};

module.exports = swartzInit;