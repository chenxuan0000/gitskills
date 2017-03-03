/*！
 *资源库
 *date:2016-10-27
 *author: chenxuan;
 */

(function(win, $) {
    var $sourceBd = $('#source-bd'),
        $sourceHd = $('#source-hd'),
        resourceType = $sourceHd.children('.material').data('type'),
        $type = $sourceBd.find('.select-type');
    var M = Mustache,
        html = [],
        type = Util.getUrlParams().type || '002001',
        tab = Util.getUrlParams().tab || 0,
        value = Util.getUrlParams().value || '',
        keyWords = Util.getUrlParams().keyWords || '',
        PageIndex = 1, //页码
        PageSize = 6, //每页信息数量
        tem1 = $('#tmpl1').html(),
        tem2 = $('#tmpl2').html(),
        tem3 = $('#tmpl3').html(),
        para = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {}
        },
        para1 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {}
        },
        para3 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {
                "ParentCategoryNum": "002"
            }
        };

    para1.para.keyWords = keyWords;
    //回调处理类型的默认选中
    var callBackSelect = function(a) {
        if (a) {
            var $li = $type.eq(tab).children();
            $li.removeClass('selected');
            $li.each(function() {
                var type = $(this).data('type');
                if (type == a) {
                    $(this).addClass('selected');
                    return false;
                }
            })
        }
    }
    $sourceBd.on('click', '.show-img', function() {
        var $this = $(this),
            $content = $this.closest('.content'),
            tab = $sourceBd.children().index($content),
            infoGuid = $this.data('id'),
            params = {
                "guid": infoGuid,
                "tab": tab,
                "type": type,
                "value": value,
                "key": keyWords
            },
            str = $.param(params);
        window.open("resource-detail.html?" + str);
    });
    $sourceHd.on('click', 'a', function() {
        var type1 = $(this).data('type');
        resourceType = type1;
        type = type1;
    });
    $sourceBd.on('click', '.download', function(event) {
        var href = $(this).data('id');
        location.href = href;
    });
    $type.on('click', 'li', function() {
        var $this = $(this),
            $content = $this.closest('.content'),
            index = $sourceBd.children().index($content),
            type = $this.data('type');
        para1.para.ResourceType = type;
        value = type;
        $this.addClass('selected').siblings().removeClass('selected');
        getTabList(PageIndex, PageSize, resourceType, index);

    });
    //获取栏目
    Util.ajax({
        url: MockUrl + 'CaseShow_Category_List',
        data: JSON.stringify(para3),
        success: function(data) {
            var info = data.InfoList.Info;
            $.each(info, function(i, e) {
                var num = e.CategoryNum;
                getClass(num, i);
                getTabList(PageIndex, PageSize, num, i);
            })
        }
    });
    //获取分类
    var getClass = function(num, i) {
        para.para.ItemValue = num;
        Util.ajax({
            url: MockUrl + 'getResourceFenLei_ByCategoryNum',
            data: JSON.stringify(para),
            success: function(data) {
                html.push(M.render(tem1, data.InfoList));
                $type.eq(i).empty().prepend(html.join(''));
                html = [];
                if (i == tab) {
                    callBackSelect(value);
                }
            }
        });
    };


    var getTabList = function(PageIndex, PageSize, type, i) {
        if (PageIndex && PageSize >= 0) {
            para1.para.PageIndex = PageIndex;
            para1.para.PageSize = PageSize;
            para1.para.CategoryNum = type;
        } else {
            return false;
        }
        Util.ajax({
            url: MockUrl + 'CaseShow_Resource_List',
            data: JSON.stringify(para1),
            success: function(data) {
                var InfoList = data.InfoList || [],
                    Info = InfoList.Info || [],
                    len = Info.length;
                if (len > 1) {
                    for (var x = 0; x < len; x++) {
                        Info[x].Title = unescape(Info[x].Title);
                    }
                } else {
                    Info.Title = unescape(Info.Title);
                }

                switch (i) {
                    case 0:
                        tem = tem2;
                        break;
                    case 1:
                        tem = tem2;
                        break;
                    case 2:
                        tem = tem3;
                        break;
                }
                html.push(M.render(tem, InfoList));
                $sourceBd.children().eq(i).find('.result-ul').empty().prepend(html.join(''));
                html = [];
                bulidPager(data, PageIndex, PageSize, i);
            }
        });
    };


    //分页
    function bulidPager(data, PageIndex, PageSize, i) {
        var total = data.Total,
            $pager = $("#pager" + i);
        if ($pager.pagination()) {
            $pager.pagination('destroy');
        };
        $pager.pagination({
            total: total,
            pageSize: PageSize,
            pageIndex: PageIndex - 1,
            showInfo: true,
            showJump: true,
            noInfoText: "抱歉搜索到0条记录,请重新搜索!",
            infoFormat: "{start}到{end}条, 共{total}条数据 "
        });

        layer.close(loadIndex); //关闭加载层
        $pager.on("pageClicked", function(event, data) {
            getTabList(data.pageIndex + 1, data.pageSize, resourceType, i);
            //分页按钮点击事件
        }).on("jumpClicked", function(event, data) {
            //跳转按钮点击事件
            getTabList(data.pageIndex + 1, data.pageSize, resourceType, i);
        });
    };
    new TabView({
        dom: '#tabview',
        activeCls: 'current',
        activeIndex: tab,
        triggerEvent: 'click'
    });
}(this, jQuery));
