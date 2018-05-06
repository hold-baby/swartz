const express = require("express");
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const archiver = require('archiver');
const unzip = require("node-unzip-2");
const bodyParser = require('body-parser');

const _ = require('../lib/util.js');

/**
 * 服务器接收服务
 */
function uploadServer(obj){
    // 上传服务
    const app = express();

    // 上传临时目录
    const tmpFilePath = path.resolve(process.cwd(), 'tmpFilePath');
    // 目标部署目录
    const targetDir = path.resolve(process.cwd(), obj.target); 

    // 文件大小限制 => 1M
    // const maxFieldsSize = 1 * 1024 * 1024;
    const maxFieldsSize = '';

    app.all('/', cors); 
    app.use('/',bodyParser.urlencoded({
      extended: true
    }));

    app.post("/push", function(req, res){

        let query = req.body;
        let form  = new formidable.IncomingForm();

        // 判断是否有临时目录 如果没有则创建
        if (!fs.existsSync(tmpFilePath)) {  
            fs.mkdir(tmpFilePath);  
        }

        // 把文件上传至临时目录
        form.uploadDir = tmpFilePath;
        // 设置接受的文件大小限制
        // form.maxFieldsSize = maxFieldsSize;
        // 使用文件的原扩展名
        form.keepExtensions = true; 

        form.parse(req,function(err,fields,file){

            let filePath = ""; // 文件的目录层级
            let fileName = ""; // 文件原始名字

            // 查找文件相关信息
            if(file.tmpFile){  
                filePath = file.tmpFile.path;  
            } else {  
                for(let key in file){  
                    if( file[key].path && filePath ==='' ){  
                        filePath = file[key].path;  
                        fileName = file[key].name;
                        break;  
                    }  
                }  
            }
            
            // 判断是否有部署目录 如果没有则创建
            if (!fs.existsSync(targetDir)) {  
                fs.mkdir(targetDir);  
            }

            // 获取文件后缀名
            const fileExt = filePath.substring(filePath.lastIndexOf('.'));

            fs.rename(filePath ,targetDir, function(){
                if (err) {  
                    console.info(err);  
                    res.status(400).send('400').end();
                } else {  
                    res.status(200).send('200').end();
                    exto(filePath, targetDir)
                } 
            })
        })
    })

    app.listen(obj.port, function() {  
        console.log('upload Server is running on: ', _.getIP() + ':' +obj.port);  
    }); 

    return app
}

module.exports = uploadServer;

/**
 * 解压缩
 */
function exto(targetFile, targetPath){
    deleteall(targetPath)
    fs.createReadStream(targetFile).pipe(unzip.Extract({ 
        path: targetPath
    }));
}

/*
 * 接受一个路径 执行清空操作
 */
function deleteall(path) {  
    var files = []; 
    if(fs.existsSync(path)) {  
        files = fs.readdirSync(path);  
        files.forEach(function(file, index) {  
            var curPath = path + "/" + file;  
            if(fs.statSync(curPath).isDirectory()) { // recurse  
                deleteall(curPath);  
            } else { // delete file  
                fs.unlinkSync(curPath);  
            }  
        });  
        fs.rmdirSync(path);  
    }
};

// 跨域中间件
function cors(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-File-Name");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("Content-Type", "application/json;charset=utf-8"); 
    res.header("X-Powered-By",' 3.2.1');
    res.header("Cache-Control","no-store"); 
    if (req.method == 'OPTIONS') {
        res.sendStatus(200).end();  //让options请求快速返回/
    }
    else {
        next();
    }
}