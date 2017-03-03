(function($) {
    
    // 关闭按钮
    var $close = $('.driveline-close'),
    	$line = $('.driveline'),
    	$chose = $('.has');
    $close.on('click',function(){
    	$line.addClass('hidden');
    });

    // 选择起点和终点
    $chose.on('click',function(){
    	$(this).toggleClass('checked');
    });

}(jQuery));