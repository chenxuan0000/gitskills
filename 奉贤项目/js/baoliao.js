

	(function($){
		
		$(".box").click(function(){
			$(this).addClass("selected").children(".box-radio").attr("checked",true);	
			$(this).siblings(".box").removeClass("selected").children(".box-radio").attr("checked",false)
		});
		
		
	})(jQuery); 