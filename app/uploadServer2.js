const express = require("express");
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const archiver = require('archiver');
const unzip = require("unzipper");
const bodyParser = require('body-parser');
const colors = require('colors');
const ip = require('../lib/ip');

const _ = require('../lib/util.js');

/**
 * 服务器接收服务
 */
function uploadServer2(obj){
    let _this = this;
    
    // 上传服务
    const app = express();
    try{
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

        app.all('/', _.cors); 
        app.use('/',bodyParser.urlencoded({
            extended : true
        }));

        let uploadList = [];
        let percent = 0;

        app.post("/push", (req, res) => {
            
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
                fs.mkdir(tmpdir, () => {});  
            }

            // 把文件上传至临时目录
            form.uploadDir = tmpdir;
            // 设置接受的文件大小限制
            // form.maxFieldsSize = maxFieldsSize;
            // 使用文件的原扩展名
            form.keepExtensions = true; 

            form.parse(req, (err,fields,file) => {

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
                    fs.mkdir(targetDir, () => {});  
                }

                // 获取文件后缀名
                const fileExt = filePath.substring(filePath.lastIndexOf('.'));

                // 修改文件名为原文件名
                const targetName = path.join(tmpdir, fileName);

                fs.rename(filePath ,targetName, (err) => {
                    if (err) {  
                        console.info(err);
                        uploadLock = false;
                        res.status(400).send('400').end('上传失败');
                    } else { 
                        uploadLock = false;
                        exto(targetName, targetDir).then(() => {
                            if(obj.success){
                                obj.success(res)
                            }else{
                                res.status(200).end()
                            }
                        })
                    } 
                })
            })

            form.on("progress", (bytesReceived, bytesExpected) => {
                percent = parseInt(bytesReceived / bytesExpected * 100);
            });
        })

        app.get('/get_progress', (req, res) => {
            res.status(200).send({
                percent : percent
            })
            if(percent == 100){
                percent = 0;
            }
        })

        app.listen(obj.port, () => {
            console.log("upload Server is running on: ")
            console.log(`${ip.getIP()}:${obj.port}`.yellow)
            console.log(`${ip.getIP4()}:${obj.port}`.yellow)

        }); 

        return app
    }catch(e){
        console.log(e)
    };
}

module.exports = uploadServer2;

/**
 * 解压缩
 */
function exto(targetFile, targetPath){
    return new Promise((resolve, reject) => {
        deleteall(targetPath)
        fs.createReadStream(targetFile).pipe(unzip.Extract({ 
            path: targetPath
        }));
        resolve()
    })
}

/*
 * 接受一个路径 执行清空操作
 */
function deleteall(path) {  
    var files = []; 
    if(fs.existsSync(path)) {  
        files = fs.readdirSync(path);  
        files.forEach((file, index) => {  
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