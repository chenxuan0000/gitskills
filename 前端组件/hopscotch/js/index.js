/*!
 *智能引导hopscotch
 * date: 2017.01.17
 * author: wuzhou
 */

(function(win, $) {
    var tour = {
        id: "hello-hopscotch",
        steps: [{
                title: "点击这里用户登录",
                content: "",
                target: "login-img",
                placement: "right"
            },
            {
                title: "点击这里可以搜索",
                content: "",
                target: "search",
                placement: "right",
                xOffset: -40,
                yOffset: -10
            },
            {
                title: "点击这里查看通知公告",
                content: "",
                target: "drop-ico",
                placement: "bottom",
                xOffset: "center",
                arrowOffset:135,
                width:300
            },
            {
                title: "便捷区域",
                content: "1、关注微信公众号<br/>2、智能问答<br/>3、网站引导",
                target: "micro-msg",
                placement: "left"
            }
        ],
        showPrevButton: false,
        i18n: {
            nextBtn: "下一步",
            prevBtn: "上一步",
            doneBtn: "完成"
        },
        onStart: function() {
            //执行页面开启遮罩
            $('body').prepend('<div class="ewb-guide-mask"></div>');
        },
        onEnd: function() {
            $(".ewb-guide-mask").remove();
            //执行完页面引导设置cookie
            $.cookie('guideInfo', 'finish', {
                expires: 7
            });
        },
        onClose: function() {
            $(".ewb-guide-mask").remove();
            // 关闭页面引导设置cookie
            $.cookie('guideInfo', 'finish', {
                expires: 7
            });
        }
    };

    //cookie中不存在guideInfo时执行页面引导。
    if ($.cookie('guideInfo') != 'finish') {
        hopscotch.startTour(tour);
    }

}(this, jQuery));
