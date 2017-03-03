// left tree
jQuery.support.cors = true;
(function(win, $) {
    //地址栏传来的guid
    win.PageLoad = function(userguid, token) {
        var Outboxguid = Util.getUrlParams().Outboxguid,
            lanmuUrl = 'GetWJ_Dept_V6', //3.3.2  获取指定栏目及其下所有子栏目
            $firstHead = $('#first-head'),
            $secondHead = $('#second-head'),
            $second = $('.wb-tree-tt'),
            $ul = $('#wb-tree'), //左侧树
            $nowPos = $('#ewb-now'),
            $search = $('#ewb-r-btn1'), //搜索按钮
            $input = $('#ewb-r-txt'), //输入框
            M = Mustache,
            html = [],
            tem2 = $('#info-tem').html(),
            PageSize = 20, //每页信息数量
            para2 = {
                "ValidateData": token,
                "paras": {
                    CurrentPageIndex: "1",
                    PageSize: PageSize,
                    subWebFlowOuGuid: "",
                    KeyWord: ""
                }
            };

        $("input[type='text']").placeholder();
        //把对应的guid绑定到搜索
        setGuid(Outboxguid);

        function setGuid(guid) {
            $search.attr('data-id', guid);
        }
        getColumn("", $ul, true);
        // 获取所有的栏目
        function getColumn(guid, $ul, type) {
            var para = {
                "ValidateData": token,
                "paras": {
                    OuGuid: guid
                }
            };
            Util.ajax({
                url: http1 + lanmuUrl,
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: JSON.stringify(para),
                success: function(data) {
                    var list = data.InfoList;
                    if (list === undefined) {
                        list = [];
                    }
                    $.each(list, function(i, item) {
                        var chlidNum = item.Info.subOuCount;
                        if (type) {
                            tem = chlidNum > 0 ? $('#info-tem2').html() : $('#info-tem1').html();
                        } else {
                            tem = chlidNum > 0 ? $('#info-tem4').html() : $('#info-tem3').html();
                        }
                        html.push(M.render(tem, item));
                    });
                    // 获取OA数据，并绑定到页面
                    $ul.empty().prepend(html.join(''));
                    html = [];
                },
                error: function() {
                    console.log("接口不连通");
                }
            });
        }

        //单击展开获取直属子栏目 一次生效
        $ul.on('click', 'i', function() {
            var nowOuGuid = $(this).attr('target'),
                $bot = $(this).parent().next(),
                $parent = $(this).parent();
            getColumn(nowOuGuid, $bot, false);
            $parent.toggleClass('current')
            $bot.toggleClass('block');
        });

        //获取2级页面信息列表及分页生成
        $("#pager").pagination({
            pageSize: PageSize,
            pageBtnCount: 9,
            remote: {
                url: http1 + 'GetWJ_List_V6',
                params: para2,
                success: function(data) {
                    var Info = data.InfoList;
                    if (Info === undefined) {
                        Info = [];
                    }
                    $.each(Info, function(i, item) {
                        html.push(M.render(tem2, item));
                    });
                    // 获取OA数据，并绑定到页面
                    $('#info-nav').empty().prepend(html.join(''));
                    html = [];
                },
                totalName: 'Total',
                pageParams: function(data) {
                    return {
                        "ValidateData": token,
                        "paras": {
                            CurrentPageIndex: data.pageIndex + 1,
                            PageSize: data.pageSize,
                            subWebFlowOuGuid: "",
                            KeyWord: ""
                        }
                    }
                }
            },
            showInfo: true,
            showJump: true,
            noInfoText: "抱歉搜索到0条记录,请重新搜索!",
            infoFormat: "{start}到{end}条, 共{total}条数据 "
        });


        // 点击左侧树 刷新右侧列表 以及上部的当前位置
        var clickLeftTree = function(event) {
            var clickGuid = this.target,
                clickName = $(this).html(),
                $bot = $(this).parent().next();
            $gather = $(this).parent().parent().prev().find('a'),
                fatherName = $gather.html(),
                fatherGuid = $gather.prop('target');
            guid = clickGuid;
            reLoadPage(guid, "");

        };
        $ul.on('click', 'a', clickLeftTree);
        //点击搜索
        var searchResult = function(event) {
            var title = $input.val(),
                thisGuid = $search.attr('data-id');
            reLoadPage(thisGuid, title);
        }
        $search.on('click', searchResult);

        //回车搜索
        $input.on('keypress', function(event) {
            if (event.keyCode == "13") {
                var title = $input.val(),
                    thisGuid = $search.attr('data-id');
                reLoadPage(thisGuid, title);
            }
        });

        function reLoadPage(guid, title) {
            $("#pager").pagination().options.remote.pageParams = function(data) {
                return {
                    "ValidateData": token,
                    "paras": {
                        CurrentPageIndex: data.pageIndex + 1,
                        PageSize: data.pageSize,
                        subWebFlowOuGuid: guid,
                        KeyWord: title
                    }
                }
            }
            $("#pager").pagination('remote');
        }
    };
}(this, jQuery));
