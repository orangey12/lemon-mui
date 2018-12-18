require(["./js/config.js"],function(){
    require(["mui","dom"],function(mui,dom,echarts){

				// 初始化页面
				function init(){
					mui.init()
					
					// 初始化点击事件
					clickInit()
				}
		
				function clickInit(){
					dom(".submit").addEventListener('tap',function(){
							mui.ajax({
								url:'/users/addUser',
								type:"post",
								data:{
									nick_name:dom("input").value
								},
								success:function(res){
									if(res.code==0){
										localStorage.setItem("uid",res.uid)
									}else if(res.code==1){
										localStorage.setItem("uid",res.uid)
									}
									location.href = "../../page/index.html"
								}
							})
					})
				}
				
				init()
    })
})