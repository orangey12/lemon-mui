require(["../js/config.js"],function(){
    require(["mui","dom","echars","moment","picker","poppicker","dtpicker"],function(mui,dom,echarts,moment){

		 var picker = new mui.PopPicker();
		 
		 var options = {"type":"month"}
		 
		 var dtPicker = new mui.DtPicker(options);
		 var curYear = new Date().getFullYear(),
				 curMonth = new Date().getMonth()+1;
		 var type = dom(".head-type"),
				 date = dom(".head-date"),
				 // 年月标识符
				 state = false;
		if(state){
			date.innerHTML = curYear
		}else{
			date.innerHTML = curYear + "-" +curMonth
		}		 
		
		// 初始化页面
		function init(){
			mui.init()
			// 监听主页面容器 在拖动时阻止默认事件
			dom(".wrap").addEventListener('drag', function(event) {
				event.stopPropagation();
			});
			
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			// 初始化点击事件
			clickInit()
			
			// 初始化echars
			echarsInit()

			// 渲染页面
			renderPage(2,date.innerHTML)
		}
	    var bill = dom(".bill-month-con")
		function renderPage(timeType,time,condition){
			mui.ajax("/bill/api/searchBill",{
				dataType:"json",
				data:{
					uid:localStorage.getItem("uid"),
					timeType:timeType,
					time:time
				},
				success:function(res){
					
					if(res.code===1){
						if(res.timeType == 2){
							renderTitle(res.data)
						}else{
							renderYear(res.data)
						}
					}else{
						bill.innerHTML = "暂无账单"
					}
				}
			})
		}
		// 渲染页面
		function renderTitle(data){
			var obj = {};
			
		var pay = 0,
 			income = 0
			data.forEach((item)=>{
				var time = moment(item.create_time).format("MM-DD");
				
				if(!obj[time]){
					obj[time] = []
				}
				if(item.c_type === "支出"){
					
					console.log(obj[time],item.money)
					pay += item.money*1
					
				}else{
					income += item.money*1
				}
				obj[time].push(item)
			})
			renderList(obj)
		}

		function renderYear(data){
			var obj = {};
			
			data.forEach((item)=>{
				var time = moment(item.create_time).format("YY-MM");
				if(!obj[time]){
					obj[time] = []
				}
				// if(item.c_type === "支出"){
					
				// 	obj[time].push({total:item.money}) 
				// 	pay += item.money*1
				// }else{
				// 	income += item.money*1
				// }
				obj[time].push(item)
			})
			renderYearTitle(obj)
		}

		function renderYearTitle(data){
			var html = ""
			for(var i in data){
				html += `	<li class="mui-table-view-cell mui-collapse">
								<a class="mui-navigate-right" href="#">
					
							<ul>
								<li>
									<span class="mui-icon mui-icon-compose"></span>
									<span>${i.slice(3)}月</span>
								</li>
								<li class="red">
									<span>支出</span>
									<span></span>
								</li>
								<li class="green">
									<span>收入</span>
									<span></span>
								</li>
								<li class="gray">
									<span>结余</span>
									<span></span>
								</li>
							</ul>
						</a>
						<div class="mui-collapse-content">
							<!-- 详细内容 -->
								<ol class="mui-table-view">`
				html += renderLi(data[i])			
				html +=	`	 </ol>
					 
				</div>
			</li>`
			dom(".table-wrap").innerHTML = html
			}
		}
	
		function renderList(data){
			var html = ''
			for(var i in data){
				html += `<div class = "bill-title">
					<p><span class="mui-icon mui-icon-chatbubble"></span> <span>${i}</span></p>
					<p>花费 <span class="pay"></span></p>
				</div>
				<ul class="mui-table-view">`
			
				html += renderLi(data[i]);					
				html+=	`</ul>`
			}
			bill.innerHTML = html;
			
		}

		function renderLi(data){
			return data.map((item)=>{
				
				return `<li class="mui-table-view-cell" data-lid=${item.lid}>
						<div class="mui-slider-right mui-disabled">
							<a class="mui-btn mui-btn-red">删除</a>
						</div>
						<div class="mui-slider-handle">
							<p>
								<span class="${item.c_icon}"></span>
								<span>${item.c_name}</span>
							</p>
							<span class="${item.c_type ==='支出' ? 'red' : 'green'}">${item.money}</span>
						</div>
					</li>`
			}).join("")
		}
		function clickInit(){
			
			// 点击显示侧边栏
			dom("#aside").addEventListener("tap",function(){
				mui('.mui-off-canvas-wrap').offCanvas('show');
				
			})
			
			// 点击确定关闭侧边栏
			dom(".sure").addEventListener("tap",function(){
				mui(".mui-off-canvas-wrap").offCanvas('close')
			})
			
			// 点击选择年月
			type.addEventListener("tap",function(){
				var that = this
				timeInit(that)
			})
			
			// 点击选择详细日期
			date.addEventListener("tap",function(){
				var that = this

				dateInit(that)
			})
		
			// 点击tab切换
			mui("#classify-con").on("tap","span",function(){
				this.className = 'cur'
				if(this.innerHTML == "图表"){
					this.previousElementSibling.className=""
					dom(".chart").style.display = "block"
					dom(".bill-con").style.display = "none"
				}else{
					this.nextElementSibling.className=""
					dom(".chart").style.display = "none"
					dom(".bill-con").style.display = "block"
				}
			})
		
			// 点击进入分类页面
			dom(".add").addEventListener("tap",function(){
				location.href = "./classify.html"
			})
		}
		
		// 初始化年月
		function timeInit(that){
			
			picker.setData([{value:'month',text:'月'},{value:'year',text:'年'}]);
			picker.show(function (selectItems) {
				that.innerHTML = selectItems[0].text
				if(selectItems[0].value == "year"){
					date.innerHTML = curYear;	
					dom(".bill-month").style.display = 'none';
					dom(".bill-year").style.display = 'block';
					state = true;
					renderPage(1,date.innerHTML)

				}else{
					dom(".bill-month").style.display = 'block';
					dom(".bill-year").style.display = 'none';
					date.innerHTML = curYear + "-" +curMonth;
					state = false
					renderPage(2,date.innerHTML)
				}
				// console.log(selectItems[0].text);//智子
// 				console.log(selectItems[0].value);//zz 
			})
		}

		// 初始化日期
		function dateInit(that){
			
			 
			// 判断当前是年还是月
			if(state == true){
					dom('h5[data-id="title-y"]').style.width = "100%"
					dom('h5[data-id="title-m"]').style.display = 'none';
					dom('div[data-id="picker-m"]').style.display = 'none'
					dom('div[data-id="picker-y"]').style.width = '100%'

				
				dtPicker.show(function (selectItems) { 
					that.innerHTML = selectItems.y.value 
					console.log(selectItems.y);//{text: "2016",value: 2016} 
					console.log(selectItems.m);//{text: "05",value: "05"} 
					renderPage(1,date.innerHTML)	
				})
			}else{
				dom('h5[data-id="title-y"]').style.width = "50%"
				dom('h5[data-id="title-m"]').style.display = 'inline-block';
				dom('div[data-id="picker-m"]').style.display = 'inline-block'
				dom('div[data-id="picker-y"]').style.width = '50%'
				dtPicker.show(function (selectItems) { 
					that.innerHTML = selectItems.y.value + "-" +selectItems.m.value
					console.log(selectItems.y);//{text: "2016",value: 2016} 
					console.log(selectItems.m);//{text: "05",value: "05"} 
					renderPage(2,date.innerHTML)	
				})
			}
			
		}
		
		// 初始化echars
		function echarsInit(){
			var myChart = echarts.init(dom("#echar"));
			option = {
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				series: [
					{
						name:'访问来源',
						type:'pie',
						selectedMode: 'single',
						radius: [0, '30%'],

						label: {
							normal: {
								position: 'inner'
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						}
					},
					{
						name:'访问来源',
						type:'pie',
						radius: ['40%', '55%'],
						data:[
							{value:335, name:'直达'},
							{value:310, name:'邮件营销'},
							{value:234, name:'联盟广告'},
							{value:135, name:'视频广告'},
							{value:1048, name:'百度'},
							{value:251, name:'谷歌'},
							{value:147, name:'必应'},
							{value:102, name:'其他'}
						]
					}
				]
			};
			 myChart.setOption(option);
		}
		init()
    })
})