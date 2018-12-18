require(["../js/config.js"],function(){
	require(["mui","dom","format"],function(mui,dom,format){
		
		
		function Init(){
			mui.init();
			
			// 请求数据
			renderIcon()
			
			// 点击事件
			clickInit()
		}
		
		// 点击事件
		function clickInit(){
			mui(".mui-slider-group").on("tap","span",function(){
				dom("#cur").className = this.className
			})
			
			// 添加分类
			dom(".save").addEventListener("tap",function(){
				var typeIcon = decodeURI(location.search.slice(1).split('=')[1])
				mui.ajax({
					url:"/classify/api/addClassify",
					type:"post",
					data:{
						uid : localStorage.getItem("uid"),
						c_name:dom('input').value,
						c_icon:dom('#cur').className,
						c_type:typeIcon
					},
					success:function(res){
						if(res.code==1){
							location.href = "../page/classify.html"
						}else{
							alert(res.msg)
						}
					}
				})
			})
		}
		
				// 渲染页面
				function renderIcon(){
					mui.ajax({
						url:"/classify/api/selectIcon",
						success:function(res){
							if(res.code==1){
								var len = 8;
								var data  = res.data.slice(0)
								var arr = format(data,len)
								render(arr)
							}
						}
					})
				}
				
				function render(data){
					data.forEach((item)=>{
						var html = `<div class="mui-slider-item">
							<ul class="slide-wrap">`
						html +=	renderList(item);
								
								
		// 						<li id="custom">
		// 							<span class="mui-icon mui-icon-plus"></span>
		// 							<span>自定义</span>  
		// 						</li>
						html += `	</ul>
						</div>`
						dom(".mui-slider-group").innerHTML += html
						var slider = mui(".mui-slider").slider()
						slider.gotoItem(0,0)
					})
				}
				
				function renderList(data){
					return data.map(item=>{
						return `<li>
						<span class="${item.icon_name}"></span>
						
						</li>`
					}).join("")
				}
				
		
		Init()
	})
})