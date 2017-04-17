// 导航点击
(function($) {
    var $nav = $('#nav'),
        $navitem = $('.nav-item', $nav);
    $nav.on('click', '.nav-item', function() {
        $navitem.removeClass('active');
        $(this).addClass('active');
    })
}(jQuery));

(function($) {
    // 给具有placeholder属性的元素增加此支持
    // $('input').placeholder();
}(jQuery));


// 中间块伸缩
(function($) {
    var $left = $('.nav-content'),
        $leftinner = $('.nav-cinner'),
        $right = $('.main-inner');
    $('.spread').on('click', function() {
        if ($(this).hasClass('active')) {

            setTimeout(function() {
                $left.animate({
                    'width': 320
                }, 200, function() {
                    $leftinner.css('width', '100%');
                });
            }, 80);

            setTimeout(function() {
                $right.animate({
                    'left': 371
                }, 200, function() {
                    $('#ht').removeClass('active');
                });
            }, 81);
            $(this).toggleClass('active');
        } else {
            setTimeout(function() {
                $left.animate({
                    'width': 0
                }, 200, function() {
                    $leftinner.css('width', '0');
                });
            }, 80);

            setTimeout(function() {
                $right.animate({
                    'left': 51
                }, 200, function() {
                    $('#ht').addClass('active');
                });
            }, 81);
            $(this).toggleClass('active');
        }
    })
}(jQuery));

(function($) {
    $("#tr-nav-cion").click(function() {
        var $hid = $("#tr-nav-hidden");
        if ($hid.hasClass("hidden")) {
            $hid.removeClass("hidden");
            $("#tr-nav-cion").removeClass("close-icon").addClass("open-icon");
        } else {
            $hid.addClass("hidden");
            $("#tr-nav-cion").removeClass("open-icon").addClass("close-icon");
        }
    });
}(jQuery));

(function($) {
    // 点击显示隐藏考勤详情页面
    $(".open-attence").click(function() {
        var $attence = $(".attence-main");
        if ($attence.hasClass("hidden")) {
            $attence.removeClass("hidden");
        } else {
            $attence.addClass("hidden");
        }
        // $attence.toggleClass('hidden');
    });
    // 考勤详情关闭按钮
    $(".attence-close").click(function() {
        var $attence = $(".attence-main");
        $attence.addClass("hidden");
    });
    // 附近查找关闭按钮
    $(".around-close").click(function() {
        var $around = $("#around-dot");
        $around.addClass("hidden");
    });
}(jQuery));

(function(win, $) {

    if (!window.Util) {
        window.Util = {};
    }

    $.extend(Util, {
        Scroll: function() {
            var hg = $('.nav-cinner', parent.document).height();
            $("body").height(hg).niceScroll({
                cursorcolor: "#bfcde0"
            });
        },
        backTop: function() {
            $(window).scroll(function() {
                if ($(window).scrollTop() > 100) {
                    $(".backTop").fadeIn(500);
                } else {
                    $(".backTop").fadeOut(500);
                }
            });

            $(".backTop").click(function() {
                $('body').animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        }
    });
}(this, jQuery));
