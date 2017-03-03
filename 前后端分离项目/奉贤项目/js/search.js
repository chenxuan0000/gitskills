/*！
 * 奉贤项目-首页
 * date:2016-09-14
 * author: chenxuan;
 */
(function(win, $) {
    //搜索
    var searchUrl = 'http://infx.fengxiannet.com/ajax/Home/HomeSelect.ashx',
        template = $('#template').html(),
        title = decodeURI(Util.getUrlParams().Title),
        $searchTitle = $('#search-title'),
        para = { Sel: title }; //请求参数
    $searchTitle.append('<img src="../images/icon_01.png"> 搜索结果：' + title);

    getSearchList(1, 4); //初始化
    function getSearchList(pageSize, pageCount) {
        if (pageSize && pageCount >= 0) {
            para.PageSize = pageSize;
            para.pageCount = pageCount;
        } else {
            return false;
        }
        $.ajax({
            url: searchUrl,
            type: 'post',
            dataType: 'json',
            data: para,
            success: function(data) {
                var result = data.rows,
                    len = result.length;
                Util.changeImageUrl(len, result, defaultImage);
                for (var i = 0; i < len; i++) {
                    res = result[i];
                    res.Title = (res.Title).replace(title, '<span class="this">' + title + '</span>');
                }
                html.push(M.render(template, data));
                $('#result-list').empty().prepend(html.join(''));
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
    };
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
