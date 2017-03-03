/*！
 * 奉贤项目-个人评论
 * date:2016-09-14
 * author: chenxuan;
 */
(function(win, $) {
    //消息中心
    var msgUrl = 'http://infx.fengxiannet.com/ajax/My/CommentType.ashx',
        template = $('#template').html(),
        $list = $('#list'),
        para = {
            type: 1,
            id: loginId
        }; //请求参数
    getSearchList(1, 3); //初始化
    function getSearchList(pageSize, pageCount) {
        if (pageSize && pageCount >= 0) {
            para.PageSize = pageSize;
            para.pageCount = pageCount;  //参数赋值
        } else {
            return false; //跳出
        }
        $.ajax({
            url: msgUrl,
            type: 'post',
            dataType: 'json',
            data: para,
            success: function(data) {
                var result = data.rows,
                    len = result.length;
                for (var i = 0; i < len; i++) {
                    var id = result[i].Url.split('id=')[1];
                    result[i].Url = Util.returnUrl(result[i].Type) + '?id=' + id; //获取当前信息对应的详细页面地址
                }
                Util.changeImagesUrl(len, result, defaultIcon); //改变imageurl  common.js
                html.push(M.render(template, data));
                $list.empty().prepend(html.join(''));
                html = []; //清空html
                //生成分页
                bulidPager(data, pageSize, pageCount);
                layer.close(loadIndex); //关闭加载层
            },
            error: function() {
                console.log('接口不连通');
                layer.close(loadIndex); //关闭加载层
            }
        });
    }

    //分页
    function bulidPager(data, pageSize, pageCount) {
        var total = data.total;
        if ($("#pager").pagination()) {
            $("#pager").pagination('destroy');
        };
        $("#pager").pagination({
            total: total,
            pageSize: pageCount,
            pageIndex: pageSize - 1,
            showInfo: true,
            showJump: true,
            noInfoText: "抱歉搜索到0条记录,请重新搜索!",
            infoFormat: "{start}到{end}条, 共{total}条数据 "
        });
        $("#pager").on("pageClicked", function(event, data) {
            getSearchList(data.pageIndex + 1, data.pageSize);
            //分页按钮点击事件
        }).on("jumpClicked", function(event, data) {
            //跳转按钮点击事件
            getSearchList(data.pageIndex + 1, data.pageSize);
        });
    };
}(this, jQuery));
