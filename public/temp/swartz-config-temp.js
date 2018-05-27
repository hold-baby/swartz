/**
 * swartz配置文件
 * 版本 : version
 */

/**
 * 启动app任务
 * 任务包含三个服务
 * 前端页面服务与与之对应的部署接收服务，静态资源服务
 */
swartz.task('app', function(){
	// 前端页面服务
	swartz.webServer({
		port : 9001, // 端口
		path : 'view', // 前端目录
		history : false // 是否开启前端路由模式 默认false
	})
	// 静态资源目录
	swartz.staticServer({
		port : 9002, // 端口
		// path : 'public', // 有了path  router则不生效
		router : { // 静态资源路由
			'/assets' : '/static/assets',
			'/fonts' : '/static/fonts'
		}
	})
	// 上传接收发布服务
	swartz.uploadServer({
		port : 9003,
		target : 'view'
	})
})

/**
 * 启动push任务
 * 任务包含一个服务
 * 打包当前目录下的文件夹，请求并发送至部署服务
 */
swartz.task('push', function(){
	swartz.pushServer({
		url : 'http://127.0.0.1:9003/push', // 上传接口地址
		path : 'view' // 待上传目录
	})
})