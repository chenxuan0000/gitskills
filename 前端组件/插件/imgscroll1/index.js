
(function($) {
	$('#slider').Xslider({
        affect: 'scrollx',//scrollx 水平轮播 scrolly 垂直轮播
        speed: 'slow',
        space: 3000,
        conbox: '.wb-slider-conbox',
        ctag: '.wb-slider-ctag',
        switcher: '.wb-slider-switcher',
        stag: '.wb-slider-stag',
        current: 'cur',
        trigger: 'click',
        boxWidth: '309',
        boxHeight: '240'
	});
})(jQuery);