/*！
 * 奉贤项目-首页
 * date:2016-09-14
 * author: chenxuan;
 */
(function(win, $) {
    //获取当前时间
    var $weather = $('#date-weather'),
        $date = $('.date', $weather),
        $mon = $('.mon', $weather),
        $day = $('.day', $weather),
        $cndate = $('.cn-day', $weather),
        $cnyear = $('.cn-year', $weather);
    var myDate = new Date(),
        year = myDate.getFullYear(),
        month = myDate.getMonth() + 1,
        date = myDate.getDate(),
        day = myDate.getDay(),
        week = ["日", "一", "二", "三", "四", "五", "六"],
        sysdate = year + "年" + month + "月" + date + "日",
        sysmon = "星期" + week[day],
        cn = GetCNDate().split(' '),
        cndate = cn[1],
        cnyear = cn[0];
    $date.html(sysdate);
    $mon.html(sysmon);
    $day.html(date);
    $cndate.html(cndate);
    $cnyear.html(cnyear);
}(this, jQuery));


(function(win, $) {
    SlideShow(2000);
    //首页tab切换
    $(".tab-nav>a").click(function() {
        $(this).addClass("tab-cur").siblings().removeClass("tab-cur");

        var index = $(".tab-nav>a").index(this);
        $(".tab-wrap>.detail").eq(index).show().siblings().hide();
    });

    $(".tab-nav>li").click(function() {

        var index = $(".tab-nav>li").index(this);
        $(".tab-wrap-h>.detail").eq(index).show().siblings().hide();
    });



    //首页新闻列表
    var urlNews = 'http://infx.fengxiannet.com/ajax/Home/IndexList.ashx',
        newsTemp1 = $('#template1').html(),
        newsTemp2 = $('#template2').html(),
        para1 = {
            PageSize: 1,
            PageCount: 7
        },
        para2 = {
            Rec: 1,
            PageSize: 1,
            PageCount: 7
        };
    getNewsList('all-news', para1); //所有新闻 新闻资讯列表
    getNewsList('recomd-news', para2); //推荐 新闻资讯列表
    function getNewsList(id, para) {
        $.ajax({
            url: urlNews,
            type: 'post',
            dataType: 'json',
            data: para,
            success: function(data) {
                var result = data.rows,
                    len = result.length;
                for (var i = 0; i < len; i++) {
                    result[i].Time = result[i].Time.split(' ')[0]; //把年月日时分秒 切成年月日
                }
                //判断第一条信息是否有图片没有设置成默认图片
                Util.changeImage1Url(1, result, defaultImage);
                //第一个列表展示
                html.push(M.render(newsTemp1, result[0]));
                $('#' + id).find('.detail-t').prepend(html.join(''));
                html = [];
                //其他列表展示
                result.shift();
                html.push(M.render(newsTemp2, data));
                $('#' + id).find('ul').prepend(html.join(''));
                html = [];
            },
            error: function() {
                console.log('接口不连通');
            }
        });
    }

    //首页活动列表
    var urlActivity1 = 'http://infx.fengxiannet.com/ajax/Act/ActivityList.ashx', //投票列表
        urlActivity2 = 'http://infx.fengxiannet.com/ajax/Act/AnswerList.ashx', //问卷答题列表
        activityTemp = $('#template3').html();
    getActiviList(urlActivity1, 'toupiao', ''); //获取投票列表
    getActiviList(urlActivity2, 'dati', 1); //获取答题列表
    getActiviList(urlActivity2, 'diaocha', 0); //获取调查问卷列表
    function getActiviList(url, id, type) {
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: { PageSize: 1, Type: type },
            success: function(data) {
                var result = data.rows,
                    len = result.length;
                if (len != 0) {
                    Util.changeImage1Url(1, result, defaultImage);
                    //第一个列表展示
                    $('#' + id).find('.left').append('<img src="' + result[0].Image1 + '">');
                    $('#' + id).find('.title').append('<li><a target="_blank" href="../activity/toupiao.html?id=' + result[0].ID + '">' + result[0].Title + '</a></li>');
                    //其他列表展示
                    result.shift();
                    html.push(M.render(activityTemp, data));
                    $('#' + id).find('ul').prepend(html.join(''));
                    html = [];
                } else {
                    return false;
                }

                layer.close(loadIndex); //关闭加载层
            },
            error: function() {
                console.log('接口不连通');
                layer.close(loadIndex); //关闭加载层
            }
        });
    }
}(this, jQuery));
