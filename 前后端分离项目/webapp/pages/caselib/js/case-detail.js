/*！
 *案例详情
 *date:2016-11-17
 *author: chenxuan;
 */
(function(win, $) {
    var par = Util.getUrlParams(),
        guid = par.guid || '',
        num = par.num || '',
        type = par.type || '',
        dir = par.dir || '',
        col = par.col || '',
        res = par.res || '',
        classic = par.classic || '',
        byText = par.byText || '',
        byType = par.byType || '',
        key = par.key || '',
        M = Mustache,
        html = [],
        tem = $('#tmpl').html(),
        para = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {
                "InfoGuid": guid,
                "CategoryNum": num,
                "CaseType": type,
                "CaseFangXiang": dir,
                "CaseColor": col,
                "CaseResult": res,
                "OrderByText": byText,
                "OrderByType": byType,
                "keyWords": key,
                "isExcellent": classic
            }
        },
        para1 = {
            "ValidateData": "Epoint_WebSerivce_**##0601",
            "para": {}
        };
    Util.ajax({
        url: MockUrl + 'CaseShow_Detail',
        data: JSON.stringify(para),
        success: function(data) {
            var detail = data.InfoDetail;
            detail.Title = unescape(detail.Title);
            if (detail.PrevInfo.Title) {
                detail.PrevInfo.Title = unescape(detail.PrevInfo.Title);
            }
            if (detail.NextInfo.Title) {
                detail.NextInfo.Title = unescape(detail.NextInfo.Title);
            }
            if (detail.InfoContent !== null) {
                detail.InfoContent = unescape(detail.InfoContent);
                detail.InfoContent = detail.InfoContent.replace(/<img[^>]+src\s*=\s*['\"]([^'\"]+)['\"][^>]*>/gi, '<a class="fancybox-buttons" data-fancybox-group="button" href="$1"><img class="loadImg" data-url="$1" src="$1" alt="" /></a>');
            }
            html.push(M.render(tem, detail));
            $('#main').empty().prepend(html.join(''));
            html = [];
            $('img.loadImg').error(function() {
                $(this).attr('src', "images/error.png").addClass('error-img').unwrap();
            })
            $('#img-list').on('click', '.error-img', function(event) {
                var $this = $(this),
                    url = $this.data('url');
                $(this).attr('src', url).removeClass('error-img').wrap('<a class="fancybox-buttons" data-fancybox-group="button" href="' + url + '"></a>');
                event.stopPropagation();
            })
            picShow();
            startFun();
            downSingle();
            clickHref();
            layer.close(loadIndex); //关闭加载层
        }
    });
    var clickHref = function() {
        $('#pre-next').on('click', 'a', function() {
            var infoGuid = $(this).data('id');
            location.href = "case-detail.html?guid=" + infoGuid + "&num=" + num + "&type=" + type + "&dir=" + dir + "&col=" + col + "&res=" + res + "&key=" + key + "&byText=" + byText + "&byType=" + byType + "&classic=" + classic;
        })
    }

    var downSingle = function() {
        $('.bigFile-download').on('click', '.single-down', function(event) {
            var href = $(this).data('id');
            location.href = href;
            para1.para.InfoGuid = $(this).data('type');
            Util.ajax({
                url: MockUrl + 'CaseShow_Information_AddDownNum',
                data: JSON.stringify(para1),
                success: function(data) {}
            });
        })
    }

    var picShow = function() {
        $('.fancybox-buttons').fancybox({
            openEffect: 'none',
            closeEffect: 'none',

            prevEffect: 'none',
            nextEffect: 'none',

            closeBtn: false,

            helpers: {
                title: {
                    type: 'inside'
                },
                buttons: {}
            },

            afterLoad: function() {
                this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
            }
        });
    }
    var startFun = function() {
        var $back = $('#backTop'),
            $down = $('#bigDown'),
            winH = $(window).height();
        $down.affix({
            offset: {
                top: 360,
                bottom: 120
            }
        });

        var move = function() {
            if (!$('body,html').is(":animated")) {
                $('body,html').animate({
                    scrollTop: 0
                }, 800);
            }
        }
        var checkPos = function(pos) {
            if ($(window).scrollTop() > pos) {
                $back.fadeIn();
            } else {
                $back.fadeOut();
            }
        }

        $back.on('click', move);
        checkPos(winH);
        $(window).on('scroll', function() {
            checkPos(winH);
        })
    }



}(this, jQuery));
