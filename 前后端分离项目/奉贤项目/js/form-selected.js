

	(function($){
		
		$(".input-group").click(function(){
			$(this).children(".circle").addClass("selected").siblings(".form-radio").attr("checked",true);	
			$(this).siblings(".input-group").children(".circle").removeClass("selected").siblings(".form-radio").removeAttr("checked",true);
		});
		
		
	})(jQuery); 

	 
	
		
		
		
		
		
		
		
		
		
		
		
		
		



