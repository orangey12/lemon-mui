define(function(){
	
		function format(data,len){
			var length = Math.ceil(data.length/len)
			var arr = [];
			for(var i=0;i<length;i++){
				arr.push(data.splice(0,len))
			}
			return arr
		}
	return format
	
})