(function(win, $) {

    //新闻详情
    var detailUrl = 'http://infx.fengxiannet.com/ajax/New/NewDetail.ashx', //新闻详情接口
        detailTemp = $('#template').html(),
        id = Util.getUrlParams().id, //信息id
        commentUrl = 'http://infx.fengxiannet.com/ajax/Home/CommList.ashx', //评论列表接口
        commentTemp = $('#template1').html(),
        para = {
            id: id,
            type: 8
        }, //获取评论列表参数
        para2 = {
            id: loginId, //用户id
            type: 8,
            LifeID: id //新闻id
        }, //获取点赞收藏情况参数
        para3 = {
            AccountId: loginId, //用户id
            id: id, //信息id
            type: 8
        }, //添加评论情况参数
        judgeUrl = 'http://infx.fengxiannet.com/ajax/inter/UserToSel2.ashx', //判断是否已经点赞收藏
        clickUrl = 'http://infx.fengxiannet.com/ajax/inter/UserToApply.ashx', //点赞收藏操作
        commentAddUrl = 'http://infx.fengxiannet.com/ajax/Home/CommAdd2.ashx'; //添加评论操作
    //获取新闻详情
    $.ajax({
        url: detailUrl,
        type: 'post',
        dataType: 'json',
        data: { id: id },
        success: function(data) {
            var type = data.HomeType,
                img = data.Images,
                mp4 = data.MP4;
            //正则处理img 标签的地址 所有详情页的图片应该都要处理
            data.Information = data.Information.replace(/<img[^>]+src\s*=\s*['\"]([^'\"]+)['\"][^>]*>/gi, '<img src="http://infx.fengxiannet.com$1">');

            //新闻详情展示
            html.push(M.render(detailTemp, data));
            $('#content').empty().prepend(html.join(''));
            //如果要展示images 展示
            if (type === 0) {
                $('#content').find('.text').prepend('<img src="' + httpImg + img + '" alt="" class="info-img"/>');
            }
            if (mp4.length != 0) {
                //存在视频 初始化视频插件
                var mp4 = httpImg + mp4;
                playVideo(mp4);
            } else {
                //移除video
                $('#CuPlayer').remove();
            }
            html = [];
            //登录状态执行
            if (info) {
                getCondition();
            } else {
                //弹出登录
                $("#clicked").on('click', 'a', function() {
                    loginTo();
                });
            }
            //分享
            $("#content").find(".share").click(function() {
                $('#share').fadeToggle("slow");
            });
            layer.close(loadIndex); //关闭加载层
        },
        error: function() {
            console.log('接口不连通');
            layer.close(loadIndex); //关闭加载层
        }
    });

    //获取点赞收藏情况
    function getCondition() {
        $.ajax({
            url: judgeUrl,
            type: 'post',
            dataType: 'json',
            data: para2,
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
                cateid: id //新闻id
            },
            success: function(data) {
                tipLayer(data.msg); //提示框 方法
            },
            error: function() {
                console.log('接口不连通');
            }
        });
    };


    getSearchList(1, 5); //评论列表初始化 1-页码 5-一页评论数
    //获取评论列表
    function getSearchList(pageSize, pageCount) {
        if (pageSize && pageCount >= 0) {
            para.PageSize = pageSize;
            para.pageCount = pageCount;
        } else {
            return false;
        }
        $.ajax({
            url: commentUrl,
            type: 'post',
            dataType: 'json',
            data: para,
            success: function(data) {
                var result = data.rows,
                    len = result.length;
                Util.changeImagesUrl(len, result, defaultIcon);
                html.push(M.render(commentTemp, data));
                $('#comment-list').empty().prepend(html.join(''));
                html = [];
                $("#publish-comment").on('click', function() {
                    if (info) {
                        //登录状态执行
                        addComment();
                    } else {
                        //点击评论未登录去登录
                        loginTo();
                    }
                });
                //分页初始化
                bulidPager(data, pageSize, pageCount);
            },
            error: function() {
                console.log('接口不连通');
            }
        });
    }

    //添加评论
    function addComment() {
        para3.Cont = $('#comment-detail').val();
        console.log(para3);
        $.ajax({
            url: commentAddUrl,
            type: 'post',
            dataType: 'json',
            data: para3,
            success: function(data) {
                var success = data.success,
                    msg = data.msg;
                if (success) {
                    tipLayer('评论成功,等待管理员审核');
                } else {
                    tipLayer(msg);
                }
            },
            error: function() {
                console.log('接口不连通');
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
    //视频播放
    function playVideo(video) {
        var so = new SWFObject("player.swf", "ply", "1024", "600", "9", "#000"); //默认初始化参数
        so.addParam("allowfullscreen", "true");
        so.addParam("allowscriptaccess", "always");
        so.addParam("wmode", "opaque");
        so.addParam("quality", "high");
        so.addParam("salign", "lt");
        so.addVariable("JcScpFile", "CuSunV3setNext.xml"); //* 必须存在/播放器配置文件地址
        so.addVariable("JcScpVideoPath", video);
        so.addVariable("JcScpImg", "images/startpic.jpg"); //未自动播放时的图片
        so.addVariable("JcScpAutoPlay", "yes"); //是否自动播放
        so.write("CuPlayer");
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

    function loginTo() {
        layer.open({
            type: 2,
            title: "登录",
            area: ['520px', '450px'],
            content: '../index/login.html',
            skin: 'layer-ext-alert'
        });
    }
}(this, jQuery));
