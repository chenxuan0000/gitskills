/*！
 * 奉贤项目-旅游页面
 * date:2016-09-27
 * author: chenxuan;
 */
(function(win, $) {
    var urlImg = 'http://infx.fengxiannet.com/ajax/Home/NewBannerList.ashx',
        temImg = $('#template').html(),
        urlSelect = 'http://infx.fengxiannet.com/ajax/Life/TourismTypeList.ashx',
        temSelect = $('#template4').html(),
        $select = $('#select');
    //加载轮播图
    $.ajax({
        url: urlImg,
        type: 'post',
        dataType: 'json',
        data: { id: 6 },
        success: function(data) {
            var result = data.rows,
                len = result.length;
            for (var i = 0; i < len; i++) {
                result[i].Image = httpImg + result[i].Image;
            }
            html.push(M.render(temImg, { rows: result }));
            $('#slideContainer').prepend(html.join(''));
            html = [];
            if (len < 2) {
                $('#slidesImgs').find('li').css('display', 'block');
            } else {
                for (var i = 0; i < len; i++) {
                    $('#slideBar').append('<li>' + i + '</li>');
                }
                SlideShow(2000);
            }
        },
        error: function() {
            console.log('接口不连通');
        }
    });
    //加载景点分类列表
    $.ajax({
        url: urlSelect,
        type: 'post',
        dataType: 'json',
        data: {},
        success: function(data) {
            html.push(M.render(temSelect, data));
            $select.prepend(html.join(''));
            html = [];
        },
        error: function() {
            console.log('接口不连通');
        }
    });

    //切换
    $(".public-top>a").click(function() {
        var index = $(".public-top>a").index(this);
        $(this).addClass('current').siblings().removeClass('current');
        $(".detail>ul").eq(index).show().siblings().hide();
    });

    //生活旅游列表
    var urlLv1 = 'http://infx.fengxiannet.com/ajax/Life/AttractionsList.ashx', //景点
        urlLv2 = 'http://infx.fengxiannet.com/ajax/Life/FestivalList.ashx', //节庆
        urlLv3 = 'http://infx.fengxiannet.com/ajax/Life/TakenList.ashx', //行摄
        temLv = $('#template1').html(),
        temjq = $('#template2').html(),
        temxs = $('#template3').html(),
        para = {};

    function getLvYouList(url, id, pageSize, pageCount, para, pagerId, tem, typeNum) {
        if (pageSize && pageCount >= 0) {
            para.PageSize = pageSize;
            para.pageCount = pageCount;
            para.type = typeNum;
        } else {
            return false;
        }
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: para,
            success: function(data) {
                var result = data.rows,
                    len = result.length;
                Util.changeImageUrl(len,result,defaultImage);
                html.push(M.render(tem, data));
                $('#' + id).empty().prepend(html.join('')).append('<div class="pager" id="' + pagerId + '"><div>');
                html = []; //清空html
                for (var i = 0; i < len; i++) {
                    var star = result[i].star;
                    //添加评价星级
                    $('#' + id).children().eq(i).find('.' + id + ':lt(' + star + ')').addClass('cur');
                }

                bulidPager(url, id, data, pageSize, pageCount, para, pagerId, tem, typeNum); //生成分页

                layer.close(loadIndex); //关闭加载层
            },
            error: function() {
                console.log('接口不连通');
                layer.close(loadIndex); //关闭加载层
            }
        });
    }

    getLvYouList(urlLv1, 'jingdian', 1, 3, para, 'pager1', temLv, 0); //获取景点列表
    //景点分类点击进行筛选
    $select.on('change', function() {
        var $this = $(this),
            type = $this.val();
            console.log(type);
        getLvYouList(urlLv1, 'jingdian', 1, 3, para, 'pager1', temLv, type);

    });
    //节庆点击 请求节庆下面的数据
    $('#span2').one('click', function() {
        loading();
        getLvYouList(urlLv2, 'jieqing', 1, 3, para, 'pager2', temjq, 0); //获取节庆列表
    });
    //行摄点击 请求行摄下面的数据
    $('#span3').one('click', function() {
        loading();
        getLvYouList2(urlLv3, 'xinshe', 1, 3, para, 'pager3', temxs, 0); //获取行摄列表
    });

    function getLvYouList2(url, id, pageSize, pageCount, para, pagerId, tem, typeNum) {
        if (pageSize && pageCount >= 0) {
            para.PageSize = pageSize;
            para.pageCount = pageCount;
            para.type = typeNum;
        } else {
            return false;
        }
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: para,
            success: function(data) {
                var result = data.rows,
                    len = result.length;
                Util.changeImage1Url(len,result,defaultImage);
                html.push(M.render(tem, data));
                $('#' + id).empty().prepend(html.join('')).append('<div class="pager" id="' + pagerId + '"><div>');
                html = []; //清空html
                for (var i = 0; i < len; i++) {
                    var res = result[i],
                        intro = result[i].Introduce;
                    if (intro.length === 0) {
                        $('#' + id).find('li').eq(i).find('.opa').remove();
                    }
                }
                bulidPager2(url, id, data, pageSize, pageCount, para, pagerId, tem, typeNum); //生成分页
                layer.close(loadIndex); //关闭加载层
            },
            error: function() {
                console.log('接口不连通');
                layer.close(loadIndex); //关闭加载层
            }
        });
    }

    //生成分页
    function bulidPager(url, id, data, pageSize, pageCount, para, pagerId, tem, typeNum) {
        var total = data.total;
        if ($("#" + pagerId).pagination()) {
            $("#" + pagerId).pagination('destroy');
        };
        $("#" + pagerId).pagination({
            total: total,
            pageSize: pageCount,
            pageIndex: pageSize - 1,
            showInfo: true,
            showJump: true,
            noInfoText: "抱歉搜索到0条记录,请重新搜索!",
            infoFormat: "{start}到{end}条, 共{total}条数据 "
        });
        $("#" + pagerId).on("pageClicked", function(event, data) {
            getLvYouList(url, id, data.pageIndex + 1, data.pageSize, para, pagerId, tem, typeNum);
            //分页按钮点击事件
        }).on("jumpClicked", function(event, data) {
            //跳转按钮点击事件
            getLvYouList(url, id, data.pageIndex + 1, data.pageSize, para, pagerId, tem, typeNum);
        });
    };

    //生成分页
    function bulidPager2(url, id, data, pageSize, pageCount, para, pagerId, tem, typeNum) {
        var total = data.total;
        if ($("#" + pagerId).pagination()) {
            $("#" + pagerId).pagination('destroy');
        };
        $("#" + pagerId).pagination({
            total: total,
            pageSize: pageCount,
            pageIndex: pageSize - 1,
            showInfo: true,
            showJump: true,
            noInfoText: "抱歉搜索到0条记录,请重新搜索!",
            infoFormat: "{start}到{end}条, 共{total}条数据 "
        });
        $("#" + pagerId).on("pageClicked", function(event, data) {
            getLvYouList2(url, id, data.pageIndex + 1, data.pageSize, para, pagerId, tem, typeNum);
            //分页按钮点击事件
        }).on("jumpClicked", function(event, data) {
            //跳转按钮点击事件
            getLvYouList2(url, id, data.pageIndex + 1, data.pageSize, para, pagerId, tem, typeNum);
        });
    };


    function loading() {
        //遮住层 缓冲
        loadIndex = layer.load(1, {
            scrollbar: false,
            shade: [0.8, '#000'],
            shift: 5
        });
    };

}(this, jQuery));
