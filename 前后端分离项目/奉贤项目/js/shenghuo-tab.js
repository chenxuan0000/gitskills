
	(function($){
		
		
		$(".public-top>span").click(function(){
			var index=$(".public-top>span").index(this);	
			$(".wrap-all>div").eq(index).show().siblings("div").hide();
			$(".public-top").find("h3").eq(index).show().siblings("h3").hide();
		});
		
		$(".public-top>.span1").click(function(){
			
			$(this).addClass("current0").siblings("span").removeClass("current1").removeClass("current2");
		});
		$(".public-top>.span2").click(function(){
			$(this).addClass("current1").siblings("span").removeClass("current0").removeClass("current2");
		});
		$(".public-top>.span3").click(function(){
			$(this).addClass("current2").siblings("span").removeClass("current1").removeClass("current0");
			
		});
		
		
		
	})(jQuery); 
	 
	
		
		
		
		
		
		
		
		
		
		
		
		
		



