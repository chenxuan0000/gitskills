/*！
 *首页
 *date:2016-10-25
 *author: chengang;
 */
$(function() {
    $('#Banner').Xslider({
        affect: 'scrollx', //scrollx 水平轮播 scrolly 垂直轮播
        speed: 1000,
        space: 3000,
        conbox: '.wb-slider-conbox',
        ctag: '.wb-slider-ctag',
        switcher: '.wb-slider-switcher',
        stag: '.wb-slider-stag',
        current: 'cur',
        trigger: 'click',
        boxWidth: '100%',
        boxHeight: '452'
    });


    var $tabbd = $('#tab-bd');
    $tabbd.on('click', '.shrink', function() {
        var $this = $(this),
            $div = $this.prev(),
            $ul = $div.children(),
            h = $ul.height();
        $this.removeClass('shrink').addClass('spread').text('收起');
        $div.animate({ height: h + 'px' });
    })
    $tabbd.on('click', '.spread', function() {
        var $this = $(this),
            $div = $this.prev();
        $this.removeClass('spread').addClass('shrink').text('更多案例');
        $div.animate({ height: '280px' });
    })

    var M = Mustache,
        html = [],
        $tabhd = $('#tab-hd'),
        $tabbd = $('#tab-bd'),
        para1 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {
                "ParentCategoryNum": "001"
            }
        },
        para2 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {
                "PageSize": 9,
                "PageIndex": 1,
                "isExcellent": 1
            }
        },
        tem1 = $('#tmpl1').html(),
        tem2 = $('#tmpl2').html(),
        tem3 = $('#tmpl3').html();
    //网站首页案例库业务列表
    Util.ajax({
        url: MockUrl + 'CaseShow_Category_List',
        data: JSON.stringify(para1),
        success: function(data) {
            var InfoList = data.InfoList;
            html.push(M.render(tem1, InfoList));
            $tabhd.empty().prepend(html.join(''));
            html = [];
            html.push(M.render(tem2, InfoList));
            $tabbd.empty().prepend(html.join(''));
            html = [];
            tab(); //启动tabview
            $.each(InfoList.Info, function(i, e) {
                getTabList(e.CategoryNum, i)
            })
        }
    });
    //对应业务列表 的展示列表
    function getTabList(guid, i) {
        para2.para.CategoryNum = guid;
        Util.ajax({
            url: MockUrl + 'CaseShow_Case_List',
            data: JSON.stringify(para2),
            success: function(data) {
                var total = data.Total,
                    InfoList = data.InfoList || [],
                    Info = InfoList.Info || [],
                    len = Info.length;
                if (len > 1) {
                    for (var x = 0; x < len; x++) {
                        Info[x].Title = unescape(Info[x].Title);
                    }
                } else {
                    Info.Title = unescape(Info.Title);
                }
                var $ul = $tabbd.find('ul').eq(i);
                html.push(M.render(tem3, InfoList));
                $ul.empty().prepend(html.join(''));
                html = [];
                //判断ul高度，确定是否显示更多案例按钮
                if (total > 3) {
                    $ul.parent().after('<div class="more-show shrink">更多案例</div>');
                }
                layer.close(loadIndex); //关闭加载层

            }
        });
    };

    // TAB切换,依赖于tabview.js组件
    function tab() {
        new TabView({
            dom: '#tabview',
            activeCls: 'current',
            triggerEvent: 'click'
        });
    }
})
