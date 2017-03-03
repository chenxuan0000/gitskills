/*！
 *案例库
 *date:2016-10-27
 *author: chenxuan;
 */
(function(win, $) {
    if (window.Util === undefined) {
        window.Util = {};
    }

    $.extend(Util, {
        pager: function(total, num, pageIndex, preClass, nextClass) {
            var leftContent = '<span class="count">共找到<em class="blue">' + total + '</em>个案例</span>',
                rightContent = '<span class="prev-btn ' + preClass + '"></span><span class="now">' + pageIndex + '</span><span>/</span><span class="total">' + num + '</span><span class="next-btn ' + nextClass + '"></span>';
            $('#smallpager').empty().append(leftContent).append(rightContent);
        }
    })
}(this, jQuery));

$(function() {
    var $filter = $('#filter'),
        $search = $('#search'),
        $searchInput = $search.find('input'),
        $searchBtn = $search.find('button'),
        $checkbox = $('#checkbox'),
        $service = $($('.service'), $filter),
        $type = $($('.type'), $filter),
        $direction = $($('.direction'), $filter),
        $color = $($('.color'), $filter),
        $smallPage = $('#smallpager');
    var M = Mustache,
        html = [],
        achieveStr = [],
        PageIndex = 1, //页码
        PageSize = 6, //每页信息数量
        $filter = $('#filter'),
        para1 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {
                "ParentCategoryNum": "001"
            }
        },
        para2 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {
                "CodeName": "案例库-色调"
            }
        },
        para3 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {}
        },
        para4 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {
                "CodeName": "案例库-成果"
            }
        },
        para5 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {}
        },
        para6 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {
                "CategoryNum": "001"
            }
        },
        keyWords = Util.getUrlParams().keyWords || '',
        CategoryNum = Util.getUrlParams().CategoryNum || '',
        CaseType = Util.getUrlParams().CaseType || '',
        CaseFangXiang = Util.getUrlParams().CaseFangXiang || '',
        OrderByText = '',
        OrderByType = '',
        CaseColor = '',
        CaseResult = '',
        tem = $('#tmpl').html(),
        tem1 = $('#tmpl1').html(),
        tem2 = $('#tmpl2').html(),
        tem3 = $('#tmpl3').html(),
        tem4 = $('#tmpl4').html();
    para3.para.keyWords = keyWords;
    para3.para.CategoryNum = CategoryNum;
    para3.para.CaseType = CaseType;
    para3.para.CaseFangXiang = CaseFangXiang;
    var check = function() {
        var $this = $(this),
            ul = $this.parent()[0],
            type = $this.data('type'),
            index = $filter.find('ul').index(ul);
        switch (index) {
            case 2:
                CaseFangXiang = type;
                para3.para.CaseFangXiang = type;
                break;
            case 3:
                CaseColor = type;
                para3.para.CaseColor = type;
                break;
        }
        getTabList(PageIndex, PageSize); //筛选列表
        $this.addClass('selected').siblings().removeClass('selected');

    }
    $direction.on('click', 'li', check); //方向筛选
    $color.on('click', 'li', check); //色调筛选

    $service.on('click', 'li', function() { //业务筛选联动
        var type = $(this).data('type');
        para3.para.CategoryNum = type;
        CategoryNum = type;
        para3.para.CaseType = "";
        para3.para.CaseFangXiang = "";
        getTabList(PageIndex, PageSize); //筛选列表
        $(this).addClass('selected').siblings().removeClass('selected');
        para5.para.CategoryNum = type;
        Util.ajax({
            url: MockUrl + 'getCaseTypeAndFangXiangByCategoryNum',
            data: JSON.stringify(para5),
            success: function(data) {
                html.push(M.render(tem, data.CaseFangXiangInfo)); //方向
                $filter.find(".direction").children('ul').empty().prepend(html.join(''));
                html = [];
                html.push(M.render(tem, data.CaseTypeInfo)); //类型
                $filter.find(".type").children('ul').empty().prepend(html.join(''));
                html = [];
            }
        });
    });

    $type.on('click', 'li', function() { //类型筛选联动
        var type = $(this).data('type');
        CaseType = type;
        para3.para.CaseType = type;
        para3.para.CaseFangXiang = "";
        getTabList(PageIndex, PageSize); //筛选列表
        $(this).addClass('selected').siblings().removeClass('selected');
        para5.para.CaseType = type;
        Util.ajax({
            url: MockUrl + 'getCaseFangXiangByCategoryNumOrType',
            data: JSON.stringify(para5),
            success: function(data) {
                html.push(M.render(tem, data.CaseFangXiangInfo)); //方向
                $filter.find(".direction").children('ul').empty().prepend(html.join(''));
                html = [];
            }
        });
    });
    //成果筛选
    $checkbox.on('change', 'input', function() {
        var $check = $checkbox.find('input:checked'),
            arr = [],
            str;
        $check.each(function(i, e) {
            arr.push(e.value);
        })
        str = arr.join(';');
        CaseResult = str;
        para3.para.CaseResult = str;
        getTabList(PageIndex, PageSize); //筛选列表
    })

    //最新和下载量排序
    $search.on('click', '.order', function() {
            var $this = $(this),
                PageIndex = para3.para.PageIndex,
                id = this.id;
            if ($this.hasClass('selected')) {
                if ($this.hasClass('reverse')) {
                    para3.para.OrderByType = 1;
                    OrderByType = 1;
                    $this.removeClass('reverse');
                    getTabList(PageIndex, PageSize); //筛选列表
                } else {
                    para3.para.OrderByType = 0;
                    OrderByType = 0;
                    $this.addClass('reverse');
                    getTabList(PageIndex, PageSize); //筛选列表
                }
            } else {
                $this.addClass('selected').siblings().removeClass('selected');
                para3.para.OrderByText = id;
                OrderByText = id;
                para3.para.OrderByType = 1;
                OrderByType = 1;
                getTabList(PageIndex, PageSize); //筛选列表
            }
        })
        //点击搜索
    $searchBtn.on('click', function() {
        var title = $searchInput.val(); //搜索字段 全局
        para3.para.keyWords = title;
        keyWords = title;
        getTabList(PageIndex, PageSize); //筛选列表
    });

    //回车搜索
    $searchInput.on('keypress', function(event) {
        var title = $searchInput.val(); //搜索字段 
        if (event.keyCode == "13") {
            para3.para.keyWords = title;
            keyWords = title;
            getTabList(PageIndex, PageSize); //筛选列表
        }
    });

    var callBackSelect = function(a, $ul) {
            if (a) {
                var $li = $ul.children('li');
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
        //获取业务类型
    Util.ajax({
        url: MockUrl + 'CaseShow_Category_List',
        data: JSON.stringify(para1),
        success: function(data) {
            var $ul = $filter.find(".service").children('ul');
            html.push(M.render(tem1, data.InfoList));
            $ul.empty().prepend(html.join(''));
            html = [];
            callBackSelect(CategoryNum, $ul);
        }
    });
    //案例库初始类型方向列表
    Util.ajax({
        url: MockUrl + 'getCaseTypeAndFangXiangByCategoryNum',
        data: JSON.stringify(para6),
        success: function(data) {
            html.push(M.render(tem, data.CaseTypeInfo));
            var $ul1 = $filter.find(".type").children('ul');
            $ul1.empty().prepend(html.join(''));
            callBackSelect(CaseType, $ul1);
            checkHeight($ul1);
            html = [];
            html.push(M.render(tem, data.CaseFangXiangInfo));
            var $ul2 = $filter.find(".direction").children('ul');
            $ul2.empty().prepend(html.join(''));
            html = [];
            callBackSelect(CaseFangXiang, $ul2);
            checkHeight($ul2);
        }
    });
    //案例库筛选色调列表
    Util.ajax({
        url: MockUrl + 'Frame_Code_Item_List',
        data: JSON.stringify(para2),
        success: function(data) {
            html.push(M.render(tem3, data.InfoList));
            var $ul = $filter.find(".color").children('ul');
            $ul.empty().prepend(html.join(''));
            html = [];
        }
    });

    //获取成果
    Util.ajax({
        url: MockUrl + 'Frame_Code_Item_List',
        data: JSON.stringify(para4),
        success: function(data) {
            html.push(M.render(tem2, data.InfoList));
            var $achieve = $filter.find(".achievement");
            $achieve.empty().prepend(html.join(''));
            html = [];
        }
    });
    $('#result-ul').on('click', '.show-img', function() {
        var infoGuid = $(this).data('id'),
            params = {
                "guid": infoGuid,
                "num": CategoryNum,
                "type": CaseType,
                "dir": CaseFangXiang,
                "col": CaseColor,
                "res": CaseResult,
                "key": keyWords,
                "byText": OrderByText,
                "byType": OrderByType
            },
            str = $.param(params);
        window.open("case-detail.html?" + str);
    });
    //筛选结果列表 的展示列表
    getTabList(PageIndex, PageSize);

    function getTabList(PageIndex, PageSize) {
        if (PageIndex >= 0 && PageSize >= 0) {
            para3.para.PageIndex = PageIndex;
            para3.para.PageSize = PageSize;
        } else {
            return false;
        }
        Util.ajax({
            url: MockUrl + 'CaseShow_Case_List',
            data: JSON.stringify(para3),
            success: function(data) {
                var InfoList = data.InfoList || [],
                    Info = InfoList.Info || [],
                    len = Info.length,
                    total = data.Total,
                    num = Math.ceil(total / PageSize);
                if (len > 1) {
                    for (var x = 0; x < len; x++) {
                        Info[x].Title = unescape(Info[x].Title);
                    }
                } else {
                    Info.Title = unescape(Info.Title);
                }
                html.push(M.render(tem4, InfoList));
                $('#result-ul').empty().prepend(html.join(''));
                html = [];
                if (num === 0) {
                    PageIndex = 0;
                }
                bulidPager(data, PageIndex, PageSize);
                if (num < 2) {
                    Util.pager(total, num, PageIndex, 'disabled', 'disabled');
                } else if (PageIndex === 1) {
                    Util.pager(total, num, PageIndex, 'disabled', '');
                    nextClick(PageIndex, PageSize);
                } else if (PageIndex === num) {
                    Util.pager(total, num, PageIndex, '', 'disabled');
                    preClick(PageIndex, PageSize);
                } else {
                    Util.pager(total, num, PageIndex, '', '');
                    nextClick(PageIndex, PageSize);
                    preClick(PageIndex, PageSize);
                }
            }
        });
    };

    // 小分页
    function preClick(PageIndex, PageSize) {
        $('.prev-btn', $smallPage).on('click', function() {
            PageIndex -= 1;
            getTabList(PageIndex, PageSize);
        })
    }

    function nextClick(PageIndex, PageSize) {
        $('.next-btn', $smallPage).click('click', function() {
            PageIndex += 1;
            getTabList(PageIndex, PageSize);
        })

    }

    //分页
    function bulidPager(data, PageIndex, PageSize) {
        var total = data.Total;
        if ($("#pager").pagination()) {
            $("#pager").pagination('destroy');
        };
        $("#pager").pagination({
            total: total,
            pageSize: PageSize,
            pageIndex: PageIndex - 1,
            showInfo: true,
            showJump: true,
            noInfoText: "抱歉搜索到0条记录,请重新搜索!",
            infoFormat: "{start}到{end}条, 共{total}条数据 "
        });

        layer.close(loadIndex); //关闭加载层
        $("#pager").on("pageClicked", function(event, data) {
            getTabList(data.pageIndex + 1, data.pageSize);
            //分页按钮点击事件
        }).on("jumpClicked", function(event, data) {
            //跳转按钮点击事件
            getTabList(data.pageIndex + 1, data.pageSize);
        });
    };
    //判断下筛选信息的多少 是否增加更多按钮
    function checkHeight($this) {
        var h = $this.height();
        if (h > 90) {
            $this.after('<span class="button shrink">更多</span>');
        }
    }
    $filter.on('click', '.shrink', function() {
        var $this = $(this),
            h = $this.prev().height(),
            $parent = $this.parent();
        $this.removeClass('shrink').addClass('spread').text('收起');
        $parent.animate({ maxHeight: h + 'px' }, 300);
    }).on('click', '.spread', function() {
        var $this = $(this),
            $parent = $this.parent();
        $this.removeClass('spread').addClass('shrink').text('更多');
        $parent.animate({ maxHeight: '64px' }, 300);
    })
})
