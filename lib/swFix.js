const fs = require('fs');
const colors = require('colors');

/**
 * 配置文件依赖处理
 * @sw 		String
 * return 	string
 * des		配置文件引入的依赖只能是本地文件（且必须有扩展名）
 * des		不支持引入当前项目安装的依赖
 */
function swFix(sw){
	const reg = /require\((\.*?)[^)]*?\)/g;

	// 查询所以的require注入
	let requireLIst = sw.match(reg);
	// 定义配置文件中的依赖注入映射对象
	let requireMap = {};

	requireLIst = requireLIst.map((item) => {
		const key = item;

		requireMap[key] = '';
		item = item.replace('require(', "");
		item = item.replace(')', "");
		item = item.replace(/\"|'/g, "");
		requireMap[key] = item;

		return item
	});

	for(let i in requireMap){
		const addr = process.cwd().replace(/\\/g,'/') + '/' + requireMap[i];

		if(fs.existsSync(addr)){
			// 存在
			sw = sw.replace(i, 'require("' + addr + '")')
		}else{
			// 不存在
			const warn = i + ' 不支持模块注入，请使用具体的文件并且有文件扩展名!'
			sw = sw.replace(i, 'null;')
			console.log(warn.yellow)
		}
	};

	return sw
}

module.exports = swFix;