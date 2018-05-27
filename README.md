# swartz
![logo](./public/img/swartz_logo.png)
### 安装
```
npm  i  swartz -g
```
### API
创建配置文件(必须)sw-config.js
```
// 服务端部署
swartz.task('app'){
	// web服务
	swartz.webServer({
		port : xxxx, // 端口
		path : 'www', // 服务目录
		history : false // 是否启用history模式
	});
	// 静态资源服务
	swartz.static({
		port : xxxx, // 端口
		path : 'static', // 资源目录
		router : { 	 // 路由转发配置(如果配置了path，则router配置不生效)
			'/assets' : '/static/assets'
		}
	});
	swartz.uploadServer({
		prot : xxxx, // 端口
		target : 'target', // 上传目标目录
		keys : 'keys' // 上传验证凭证(可选)
	})
};

// 发布配置
swartz.task('push', function(){
	swartz.pushServer({
		url : 'http://127.0.0.1:xxxx/push', // 上传接收地址
		path : 'path', // 待上传目录（会打包成压缩包上传）
		keys : 'keys' // 上传验证凭证(可选)
	})
});
```
### 使用
```
swartz init // 创建配置文件
swartz app // 执行配置文件中的app任务
swartz push // 执行配置文件中的push任务
swartz app => sw app // swartz可简写成sw
```
