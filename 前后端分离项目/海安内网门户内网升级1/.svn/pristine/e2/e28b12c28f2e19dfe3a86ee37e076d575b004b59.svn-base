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
            $input = $('#ewb-r-txt'), //输入框
            para = {
                "ValidateData": token,
                "paras": {
                    UserGuid: userguid,
                    CateGoryGuid: guid
                }
            };
            
     $("input[type='text']").placeholder();
        //把对应的guid绑定到搜索
        setGuid(guid);

        function setGuid(guid) {
            $search.attr('data-id', guid);
        }
        // 获取所有的栏目
        Util.ajax({
            url: http + lanmuUrl,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(para),
            success: function(data) {
                var list = data.CateGoryList;
                if (list === undefined) {
                    list = [];
                }
                var length = list.length,
                    list0 = list[0].CateGoryInfo,
                    MaxName = list0.CategoryName;
                //顶级栏目
                $firstHead.empty().html(MaxName);
                $secondHead.empty().html(MaxName);
                $nowPos.append('<a class="ewb-now-link" id="first-nav" target="' + guid + '"> &gt; ' + MaxName + '</a>');
                for (var i = 1; i < length; i++) {
                    var listInfo = list[i].CateGoryInfo,
                        eveGuid = listInfo.CategoryGuid,
                        eveNum = listInfo.CategoryNum,
                        eveName = listInfo.CategoryName,
                        numLen = eveNum.length,
                        usedId;
                    parentGuid = listInfo.ParentCategoryGuid;
                    if (numLen === 6) {
                        usedId = eveGuid;
                        $ul.append('<li class="wb-tree-items"><h3 class="wb-tree-node"><i class="wb-tree-iconl"></i><a target="' + eveGuid + '"  class="wb-tree-tt">' + eveName + '</a></h3><ul class="wb-tree-sub" id="' + eveGuid + '"></ul></li>');
                    } else if (numLen === 9) {
                        var $secg = $('#' + usedId);
                        $secg.append('<li class="wb-tree-item"><a target="' + eveGuid + '">' + eveName + '</a></li>');
                        $secg.parent().addClass('haschild');
                        $secg.prev().append('<i class="wb-tree-iconr"></i>');
                    }

                }
            },
            error: function(error) {
                console.log("接口不连通");
            }
        });

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
            pageBtnCount:9,
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
            if ($(this).hasClass('wb-tree-tt')) {
                $nowPos.append('<a class="ewb-now-link" target="' + clickGuid + '"> &gt; ' + clickName + '</a>');
            } else {
                $nowPos.append('<a target="' + fatherGuid + '"> &gt; ' + fatherName + '</a><a class="ewb-now-link" target="' + clickGuid + '"> &gt; ' + clickName + '</a>');
            };

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
