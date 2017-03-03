// left tree
jQuery.support.cors = true;
(function(win, $) {
    //地址栏传来的guid
    win.PageLoad = function(userguid, token) {
        var guid = Util.getUrlParams().CategoryGuid,
            lanmuUrl = 'Webinfo_GetCateTreeByCateGoryGuid_V6', //3.3.2  获取指定栏目及其下所有子栏目
            $firstHead = $('#first-head'),
            $secondHead = $('#second-head'),
            $second = $('.wb-tree-tt'),
            $ul = $('#wb-tree'), //左侧树
            $nowPos = $('#ewb-now'),
            $search = $('#ewb-r-btn1'), //搜索按钮
            $input = $('#ewb-r-txt'); //输入框

        // 配置栏目guid
        $('#software').attr('target', categoryGuid['software']);
        $('#drivedown').attr('target', categoryGuid['drivedown']);
        $('#trainmaterials').attr('target', categoryGuid['trainmaterials']);
        $("input[type='text']").placeholder();
        //把对应的guid绑定到搜索
        setGuid(guid);

        function setGuid(guid) {
            $search.attr('data-id', guid);
        }

        //获取2级页面信息列表及分页生成
        var M = Mustache,
            html = [],
            tem = $('#info-tem').html(),
            PageSize = 20, //每页信息数量
            para2 = {
                "ValidateData": token,
                "paras": {
                    CurrentPageIndex: 0,
                    PageSize: PageSize,
                    UserGuid: userguid,
                    CategoryGuid: guid,
                    KeyWord: ""
                }
            };
        $("#pager").pagination({
            pageSize: PageSize,
            pageBtnCount: 9,
            remote: {
                url: http + 'WebInfo_GetView_NoRight_V6',
                params: para2,
                success: function(data) {
                    var Info = data.InfoList;
                    if (Info === undefined) {
                        Info = [];
                    }
                    $.each(Info, function(i, item) {
                        html.push(M.render(tem, item));
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
                            UserGuid: userguid,
                            CategoryGuid: guid,
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
                $gather = $(this).parent().parent().prev().find('a'),
                fatherName = $gather.html(),
                fatherGuid = $gather.prop('target');
            guid = clickGuid;
            setGuid(guid)
            $secondHead.empty().html(clickName);
            $("#first-nav").nextAll().empty().end().removeClass('ewb-now-link'); //点击清空
            //清除一级栏目的默认样式
            $nowPos.append('<a class="ewb-now-link" target="' + clickGuid + '"> &gt; ' + clickName + '</a>');
            reLoadPage(guid, "");
        };
        $ul.on('click', 'a', clickLeftTree);
        // 当前位置点击刷新
        var clickNowPos = function(event) {
            var thisName = $(this).html(),
                subThisName = thisName.substring(6, thisName.length),
                thisGuid = this.target;
            guid = thisGuid;
            setGuid(guid)
            $(this).nextAll().empty().end().addClass('ewb-now-link');
            $secondHead.empty().html(subThisName);
            reLoadPage(guid, "");
        };

        $nowPos.on('click', 'a', clickNowPos);

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
                        UserGuid: userguid,
                        CategoryGuid: guid,
                        KeyWord: title
                    }
                }
            }
            $("#pager").pagination('remote');
        }
    };

}(this, jQuery));


(function(win, $) {
    $('.wb-tree').on('click', '.wb-tree-node', function(event) {
        var $this = $(this).parent();
        if ($this.hasClass('haschild')) {
            if (event.target.className != 'wb-tree-tt') {
                $this.toggleClass('current');
            }

        }
    });
}(this, jQuery));
