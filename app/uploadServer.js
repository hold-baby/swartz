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
    // 上传锁，同时只能允许一个上传进程
    let uploadLock = false;

    let uploadKey = '';
    if(obj.keys && typeof obj.keys === 'string'){
        uploadKey = obj.keys;
    }

    // 上传临时目录
    const tmpdir = path.resolve(process.cwd(), 'sw_tmpdir');
    // 目标部署目录
    const targetDir = path.resolve(process.cwd(), obj.target);

    // 文件大小限制 => 1M
    // const maxFieldsSize = 1 * 1024 * 1024;
    const maxFieldsSize = '';

    app.all('/', cors); 
    app.use('/',bodyParser.urlencoded({
        extended : true
    }));

    let uploadList = [];
    let percent = 0;

    app.post("/push", function(req, res){
        
        if(uploadLock){
            res.status(400).end('上传进程被占用')
        }

        uploadLock = true;

        let query = req.query;
        if(uploadKey){
            if(query.keys !== uploadKey){
                uploadLock = false;
                res.status(400).end('上传key错误')
                console.log('上传key错误')
                return
            }
        }
        let form  = new formidable.IncomingForm();

        // 判断是否有临时目录 如果没有则创建
        if (!fs.existsSync(tmpdir)) {  
            fs.mkdir(tmpdir);  
        }

        // 把文件上传至临时目录
        form.uploadDir = tmpdir;
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
                    uploadLock = false;
                    res.status(400).send('400').end('上传失败');
                } else { 
                    uploadLock = false;
                    res.status(200).send('200').end();
                    exto(filePath, targetDir)
                } 
            })
        })

        form.on("progress", function (bytesReceived, bytesExpected) {
            percent = parseInt(bytesReceived / bytesExpected * 100);
        });
    })

    app.get('/get_progress', function(req, res){
        res.status(200).send({
            percent : percent
        })
        if(percent == 100){
            percent = 0;
        }
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