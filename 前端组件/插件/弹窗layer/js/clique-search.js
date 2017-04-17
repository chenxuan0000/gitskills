
(function(win,$){
	//tab切换
	new TabView({        
    dom: $(".search-body"),    
    activeCls: 'cur',
    triggerEvent: 'click'
});
	//设置党员周边查询表td的位置
	$(".second-table tr").each(function(){
		$(this).children().eq(0).addClass("middle");
		$(this).children().eq(1).addClass("pl6");
		$(this).children().eq(2).addClass("pl10");
	});

	// 给具有placeholder属性的元素增加此支持
    $('.search-input').placeholder(); 

}(this,jQuery));