require(["../js/config.js"],function(){
	require(["mui","dom",'format',"picker","dtpicker"],function(mui,dom,format){
		var _dateNow = dom(".date-now"),
			_total = dom(".total"),
			type="支出",
			arrIcon,
			
			m = new Date().getMonth()+1,
			d = new Date().getDate();
		_dateNow.innerHTML = m+"月"+d+"日"
	
		function Init(){
			mui.init()
				
			// 初始化键盘
			keyBoardInit()
			
			// 默认展示支出图标
			getClassIcon()
			
			// 初始化点击事件
			clickInit()
		}
		var create_time;
		// 初始化点击事件
		function clickInit(){
			var type_p = dom(".type-p") 
			// 点击关闭侧边栏
			dom(".choose").addEventListener("tap",function(){
				var options = {"type":"date"}
				var dtPicker = new mui.DtPicker(options); 
				dtPicker.show(function(selectItems){
					var time = selectItems.m.value+"月"+selectItems.d.value+"日"
					create_time = selectItems.y.value+'-'+selectItems.m.value+'-'+selectItems.d.value
					_dateNow.innerHTML = time
				})
			})
			
			
			
			// 点击切换收支
			mui(".type-p").on("tap","span",function(){
				type = this.innerHTML;
				for(var i=0;i<type_p.childNodes.length;i++){
					type_p.childNodes[i].className = ""
				}
				this.className="cur"
				
				renderIcon(arrIcon,type)
			})

			// 点击图标高亮
			mui(".mui-slider-group").on("tap","span",function(){
				var arr =dom(".mui-slider-group").querySelectorAll("span");
				for(var i=0;i<arr.length;i++){
					arr[i].classList.remove("active")
				}
				this.classList.add("active")
			})
		}
		
		// 请求分类列表
		function getClassIcon(){
			mui.ajax({
				url:"/classify/api/getClassify",
				data:{
					uid:localStorage.getItem("uid")
				},
				success:function(res){
					if(res.code==1){
						var icon = iconSort(res.data)
						arrIcon = icon
						renderIcon(icon,"支出")
					}
				}
			})
		}
	
		// 渲染图标
		function renderIcon(data,val){
			dom(".mui-slider-group").innerHTML ="";
			if(data[val]===undefined){
				return
			}
			var val = data[val].slice(0);
			var data = format(val,8)
			data.forEach((item)=>{
				var html = `<div class="mui-slider-item">
				<ul class="slide-wrap">`
				html +=	renderList(item);
				html += `	</ul>
				</div>`
				dom(".mui-slider-group").innerHTML += html

			})
			var arr = Array.from(dom(".mui-slider-group").children);
			var last = arr[arr.length-1].children[0].children;
			Array.from(arr[0].querySelectorAll("span"))[0].classList.add("active")
			// 添加自定义图标
			if(last.length<8){
				 arr[arr.length-1].children[0].innerHTML +=`<li id="custom">
						<span class="mui-icon mui-icon-plus"></span>
						<span>自定义</span>  
					</li>`
			}else{
				var html = `<div class="mui-slider-item">
					<ul class="slide-wrap">
						<li id="custom">
							<span class="mui-icon mui-icon-plus"></span>
							<span>自定义</span>  
						</li>
					</ul>
				</div>`
				dom(".mui-slider-group").innerHTML += html
			}
			
			// 添加自定义图标
			dom("#custom").addEventListener("tap",function(){
				location.href="../../page/icon.html?type="+type
			})
			
			var slider = mui(".mui-slider").slider()
			// 切换为首页
			slider.gotoItem(0,0)
		}
	
		// 渲染图标列表
		function renderList(data){
			return data.map(item=>{
				return `<li>
				<span class="${item.c_icon}" data-cid="${item.cid}"></span>
				<span>${item.c_name}</span>
				</li>`
			}).join("")
		}
		// 图标分类
		function iconSort(data){
			var arr = {};
			 data.forEach((item)=>{
				if(!arr[item.c_type]){
					arr[item.c_type] = []
				}
				arr[item.c_type].push(item)
			})
			return arr
			
		}
		// 初始化键盘
		function keyBoardInit(){
			mui(".key-board").on("tap","span",function(){
				
				var val = this.innerHTML;
				
				var moneyVal = _total.innerHTML;
				
				// 判断是否为X 
				if(val === "X"){
					// 长度大于1才允许删除 字符串截取到倒数第二位 否则重置为0.00
					if(moneyVal.length>1){
						_total.innerHTML = moneyVal.slice(0,moneyVal.length-1)

					}else{
						_total.innerHTML = "0.00"
					}						
					// 阻止之后的代码
					return;
				}else if(val === "完成"){
					var cid = dom(".active").getAttribute("data-cid");
			
					mui.ajax({
						url:"/bill/api/addBill",
						type:"post",
						data:{
							uid:localStorage.getItem("uid"),
							cid:cid,
							money:moneyVal,
							type:type,
							create_time:create_time
						},
						success:function(res){
							console.log(res)
							if(res.code==1){
								location.href="../../page/index.html"
							}
						}
					})
					return
				}
				
				if(moneyVal === "0.00"){
					_total.innerHTML = "";
					_total.innerHTML += val;
				}else if(moneyVal.indexOf(".")!=-1 && val==="."){
					_total.innerHTML
				}else if(moneyVal.indexOf(".")!=-1 && moneyVal.split(".")[1].length==2){
					_total.innerHTML
				}else{
					_total.innerHTML += val
				}
				// console.log(str)
			})
		}
			
		Init()
	})
})