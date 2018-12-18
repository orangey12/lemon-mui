var gulp = require("gulp"),
	server = require("gulp-webserver"),
	sass = require("gulp-sass");
	
gulp.task("sass",function(){
	return gulp.src("./src/scss/**.scss")
	.pipe(sass())
	.pipe(gulp.dest("./src/css"));
})

gulp.task("watch",function(){
	return gulp.watch("./src/scss/**.scss",gulp.series("sass"))
})

gulp.task("server",function(){
	return gulp.src("./src")
	.pipe(server({
		open:true,
		port:9000,
		livereload:true,
		proxies:[
			// 添加用户
			{
				source:"/users/addUser",target:"http://127.0.0.1:3000/users/addUser"
			},
			// 添加账单
			{
				source:"/bill/api/addBill",target:"http://127.0.0.1:3000/bill/api/addBill"
			},
			// 查找图标
			{
				source:"/classify/api/selectIcon",target:"http://127.0.0.1:3000/classify/api/selectIcon"
			},
			// 查询分类
			{
				source:"/classify/api/getClassify",target:"http://127.0.0.1:3000/classify/api/getClassify"
			},
			// 添加分类 
			{
				source:"/classify/api/addClassify",target:"http://127.0.0.1:3000/classify/api/addClassify"
			},
			// 查找账单
			{
				source:"/bill/api/searchBill",target:"http://127.0.0.1:3000/bill/api/searchBill"
			}
		]
	}))
})
	
gulp.task("dev",gulp.series("sass","server","watch"))