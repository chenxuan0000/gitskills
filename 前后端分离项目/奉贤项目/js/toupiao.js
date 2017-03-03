(function(win, $) {
    //投票详情
    var detailUrl = 'http://infx.fengxiannet.com/ajax/Act/VoteList.ashx', //投票详情接口
        detailTemp = $('#template').html(),
        infoId = Util.getUrlParams().id,
        $con = $('#content');
    getActiviList(detailUrl, detailTemp, 'content'); //获取新闻详情
    function getActiviList(url, tem, id) {
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: { id: infoId },
            success: function(data) {
                var comment = data.rows,
                    len = comment.length;
                //拼接图片地址
                data.Image = httpImg + data.Image;
                //正则处理img 标签的地址 所有详情页的图片应该都要处理
                data.Introduction = data.Introduction.replace(/<img[^>]+src\s*=\s*['\"]([^'\"]+)['\"][^>]*>/gi, '<img src="http://infx.fengxiannet.com$1">');
                //投票详情展示
                html.push(M.render(tem, data));
                $('#' + id).empty().prepend(html.join(''));
                //无图片删除
                if (data.Image === httpImg) {
                    $con.find('.toupiao-img').remove();
                }
                if (len !== 0) {
                    var num1 = comment[0].Num,
                        num2 = comment[1].Num,
                        all = num1 + num2,
                        ypec = Math.round(num1 / all * 10000) / 100.00,
                        npec = 100 - ypec;
                    if (comment[0].Title = '不支持') {
                        $('.no', $con).find('.num').html(num1 + '人');
                        $('.yes', $con).find('.num').html(num2 + '人');
                        $('.span-n', $con).css('width', ypec + "%");
                        $('.span-y', $con).css('width', npec + "%");
                    } else {
                        $('.no', $con).find('.num').html(num2 + '人');
                        $('.yes', $con).find('.num').html(num1 + '人');
                        $('.span-y', $con).css('width', ypec + "%");
                        $('.span-n', $con).css('width', npec + "%");
                    }
                } else {
                    //没评论删除
                    $('#zan', $con).remove();
                };
                //登录状态执行
                if (info) {
                    getCondition();
                } else {
                    //弹出登录
                    $("#clicked").on('click', 'a', function() {
                        loginTo();
                    });
                }
                layer.close(loadIndex); //关闭加载层
            },
            error: function() {
                console.log('接口不连通');
                layer.close(loadIndex); //关闭加载层
            }
        });
    }

    var judgeUrl = 'http://infx.fengxiannet.com/ajax/inter/UserToSel2.ashx', //判断是否已经点赞收藏
        clickUrl = 'http://infx.fengxiannet.com/ajax/inter/UserToApply.ashx',
        para = {
            id: loginId, //用户id
            type: 8,
            LifeID: infoId //新闻id
        }; //点赞收藏操作
    //获取点赞收藏情况
    function getCondition() {
        $.ajax({
            url: judgeUrl,
            type: 'post',
            dataType: 'json',
            data: para,
            success: function(data) {
                var Collections = data.Collections,
                    Thumbs = data.Thumbs,
                    category = data.category;
                if (Thumbs) {
                    $("#clicked").find(".like").addClass("like-cur");
                }
                if (Collections) {
                    $("#clicked").find(".store").addClass("store-cur");
                }

                // console.log($("#clicked"));
                $("#clicked").find(".like").click(function() {
                    $(this).toggleClass("like-cur");
                    clickCondition(category, 1);
                });
                $("#clicked").find(".store").click(function() {
                    $(this).toggleClass("store-cur");
                    clickCondition(category, 0);
                });
            },
            error: function() {
                console.log('接口不连通');
            }
        });
    };
    //获取点赞收藏 操作 取消
    function clickCondition(category, type) {
        $.ajax({
            url: clickUrl,
            type: 'post',
            dataType: 'json',
            data: {
                id: loginId, //用户id
                type: type,
                category: category,
                cateid: infoId //新闻id
            },
            success: function(data) {
                tipLayer(data.msg); //提示框 方法
            },
            error: function() {
                console.log('接口不连通');
            }
        });
    };

    function loginTo() {
        layer.open({
            type: 2,
            title: "登录",
            area: ['520px', '450px'],
            content: '../index/login.html',
            skin: 'layer-ext-alert'
        });
    }

    //提示框
    function tipLayer(msg) {
        layer.alert(msg, {
            title: "提示信息",
            icon: 0,
            time: 2000,
            area: ['320px', ""],
            skin: 'layer-ext-alert'
        })
    }
}(this, jQuery));
