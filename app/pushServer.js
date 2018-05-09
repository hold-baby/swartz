const fs = require('fs');
const path = require('path');
const request = require('request');
const archiver = require('archiver');

/**
 * 客户端推送服务
 */
function pushServer(obj){
	let WEB_SERVER_ADDR = path.join(obj.path); // 待压缩目录
	let ARCHIVER_PATH = path.join(obj.path + '.zip'); // 压缩文件
	if (!fs.existsSync(WEB_SERVER_ADDR)) {  
        WEB_SERVER_ADDR = path.join(process.cwd(), obj.path); // 待压缩目录
		ARCHIVER_PATH = path.join(process.cwd(), obj.path + '.zip'); // 压缩文件 
    }

	const PUSH_URL = obj.url // 上传url

	let output = fs.createWriteStream(obj.path + '.zip');
	let archive = archiver('zip');

	function getUpload(){
		let key = obj.keys ? ('?keys=' + obj.keys) : '';
		let url = PUSH_URL + key;
		let data = fs.createReadStream(ARCHIVER_PATH)
		let form = {
			type:'zip',
			keys : obj.keys,
			file:data
		}
		request.post({
			url:url,
			formData:form,
		},(err,res,body)=>{
			if(err){
				console.log(err)
				return
			}
			if(res.statusCode === 200){
				console.log('发布成功')
			}else{
				console.log(res.statusCode, res.body)
			}
		})
	}

	output.on('close', function() {
	  console.log('压缩结束，总大小: ' + archive.pointer() + ' total bytes');
	  getUpload()

	});

	archive.on('error', function(err){
	    throw err;
	});

	archive.pipe(output);
	archive.directory(WEB_SERVER_ADDR, false);
	archive.finalize();
}

module.exports = pushServer;