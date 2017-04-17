(function($) {
    if (!window.Pager) {
        window.Pager = {};
    }

    $.extend(Pager, {

        //点击下一页
        pageDown_click: function(pageCount, pageNum, index) {
            if (pageCount > 3) {
                pageDown(pageNum, pageCount);
            } else {
                var index = $("#pageGro ul li.on").index(); //获取当前页
                if (index + 1 < pageCount) {
                    $("#pageGro li").removeClass("on"); //清除所有选中
                    $("#pageGro ul li").eq(index + 1).addClass("on"); //选中上一页
                }
            }
            isPage(pageNum + 1, pageCount);
        },

        //点击上一页
        pageUp_click: function(pageCount, pageNum, index) {
            if (pageCount > 3) {
                pageUp(pageNum, pageCount);
            } else {
                var index = $("#pageGro ul li.on").index(); //获取当前页
                if (index > 0) {
                    $("#pageGro li").removeClass("on"); //清除所有选中
                    $("#pageGro ul li").eq(index - 1).addClass("on"); //选中上一页
                }
            } +

            isPage(pageNum - 1, pageCount);
        },

        //点击数字按钮
        num_click: function(pageCount, pageNum, selector) {
            if (pageCount > 3) {
                pageGroup(pageNum, pageCount);
            } else {
                selector.addClass("on");
                selector.siblings("li").removeClass("on");
            }
            isPage(pageNum, pageCount);
        },

        //页面加载时生成按钮
        icon_load: function(pageCount) {
            //生成分页按钮
            if (pageCount > 3) {
                page_icon(1, 3, 0);
            } else {
                page_icon(1, pageCount, 0);
            }
            isPage(1, pageCount);
        }

    });

    //点击跳转页面
    function pageGroup(pageNum, pageCount) {
        switch (pageNum) {
            case 1:
                page_icon(1, 3, 0);
                break;
            case 2:
                page_icon(1, 3, 1);
                break;
            case pageCount - 1:
                page_icon(pageCount - 2, pageCount, 1);
                break;
            case pageCount:
                page_icon(pageCount - 2, pageCount, 2);
                break;
            default:
                page_icon(pageNum - 1, pageNum + 1, 1);
                break;
        }
    }

    //根据当前选中页生成页面点击按钮
    function page_icon(page, count, eq) {
        var ul_html = "";
        for (var i = page; i <= count; i++) {
            ul_html += "<li>" + i + "</li>";
        }
        $("#pageGro ul").html(ul_html);
        $("#pageGro ul li").eq(eq).addClass("on");
    }

    //上一页
    function pageUp(pageNum, pageCount) {
        switch (pageNum) {
            case 1:
                break;
            case 2:
                page_icon(1, 3, 0);
                break;
            case pageCount - 1:
                page_icon(pageCount - 2, pageCount, 0);
                break;
            case pageCount:
                page_icon(pageCount - 2, pageCount, 1);
                break;
            default:
                page_icon(pageNum - 1, pageNum + 1, 0);
                break;
        }
    }

    //下一页
    function pageDown(pageNum, pageCount) {
        switch (pageNum) {
            case 1:
                page_icon(1, 3, 1);
                break;
            case 2:
                page_icon(1, 3, 2);
                break;
            case pageCount - 1:
                page_icon(pageCount - 2, pageCount, 2);
                break;
            case pageCount:
                break;
            default:
                page_icon(pageNum - 1, pageNum + 1, 2);
                break;
        }
    }

    //是否有上一页或者下一页
    function isPage(pageNum, pageCount) {
        if (pageNum >= pageCount) {
            $('#pageGro .pageDown')[0].disabled=true;
            $('#pageGro .pageDown').addClass('unable');
        } else {
            $('#pageGro .pageDown')[0].disabled=false;
            $('#pageGro .pageDown').removeClass('unable');
        }
        if (pageNum <= 1) {
            $('#pageGro .pageUp')[0].disabled=true;
            $('#pageGro .pageUp').addClass('unable');
        } else {
            $('#pageGro .pageUp')[0].disabled=false;
            $('#pageGro .pageUp').removeClass('unable');
        }
    }


}(jQuery));
