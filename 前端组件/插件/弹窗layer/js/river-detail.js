
(function(win,$){
	//tab切换
	new TabView({       
    dom: $(".river-body"),
    activeIndex: 2,    
    activeCls: 'cur',
    triggerEvent: 'click'
});

}(this,jQuery));