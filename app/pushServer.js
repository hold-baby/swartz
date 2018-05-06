const fs = require('fs');
const path = require('path');
const request = require('request');
const archiver = require('archiver');

/**
 * 客户端推送服务
 */
function pushServer(obj){
	const WEB_SERVER_ADDR = path.join(process.cwd(), obj.dir); // 待压缩目录
	const ARCHIVER_PATH = path.join(process.cwd(), obj.dir + '.zip'); // 压缩文件
	const PUSH_URL = obj.url // 上传url

	let output = fs.createWriteStream(obj.dir + '.zip');
	let archive = archiver('zip');

	function getUpload(){
		let url = PUSH_URL;
		let data = fs.createReadStream(ARCHIVER_PATH)
		let form = {
			type:'zip',
			file:data,
			path:'/temp'
		}

		request.post({
			url:url,
			formData:form
		},(err,res,body)=>{
			if(err){
				console.log(err)
				return
			}
			console.log('发布成功')
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