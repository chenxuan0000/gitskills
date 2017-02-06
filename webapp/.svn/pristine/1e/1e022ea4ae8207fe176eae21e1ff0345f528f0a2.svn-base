//遮住层 缓冲
var loadIndex = layer.load(2, {
    scrollbar: false,
    shade: [1, '#fff'],
    shift: 5
});

// 工具方法
(function($) {
    if (!window.Util) {
        window.Util = {};
    }
    /*
     * 序列化表单元素，区别于jQuery 的serialize和serializeArray方法
     */
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.extend(Util, {
        /* 获取URL地址参数
         * prop:参数名
         */
        getUrlParams: function(prop) {
            var params = {},
                query = location.search.substring(1),
                arr = query.split('&'),
                rt;

            $.each(arr, function(i, item) {
                var tmp = item.split('='),
                    key = tmp[0],
                    val = tmp[1];

                if (typeof params[key] == 'undefined') {
                    params[key] = val;
                } else if (typeof params[key] == 'string') {
                    params[key] = [params[key], val];
                } else {
                    params[key].push(val);
                }
            });
            rt = prop ? params[prop] : params;
            return rt;
        },
        /*
         * 高亮关键字
         * string：字符串
         * key：关键字
         * cls：rgb颜色（#ff0000）或者class名
         */
        highLightKeyWords: function(string, key, cls) {
            var keys = key.split(" "),
                str = string.replace(/<!--(?:.*)\-->/g, ""), // 删除注释
                tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g, // HTML标签
                a = str.match(tags);

            var styleStr = "";

            if (!cls) {
                cls = "#ff0000";
            }
            if (cls.indexOf("#") > -1) {
                styleStr = "style='color:" + cls + "'";
            } else {
                styleStr = "class='" + cls + "'"
            }

            $.each(a, function(i, c) {
                if (!/<(?:.|\s)*?>/.test(c)) { // 非标签
                    // 开始执行替换
                    $.each(keys, function(index, con) {
                        if (con === "") {
                            return;
                        }
                        var reg = new RegExp($.RegTrim(con), "g");
                        if (reg.test(c)) {
                            // 正则替换
                            c = c.replace(reg, "♂" + con + "♀");
                        }
                    });
                    c = c.replace(/♂/g, "<span rel='mark' " + styleStr + ">")
                        .replace(/♀/g, "</span>");
                    a[i] = c;
                }
            });
            return a.join("");
        },

        // 属性求值，目前主要解决路径问题
        evalAttrs: function() {
            var $els = $('[data-eval]');

            var i = 0,
                l = $els.length;

            for (; i < l; i++) {
                var $el = $els.eq(i);
                var attrName = $el.data('eval');

                var exp = $el.attr(attrName);

                if (exp) {
                    $el.attr(attrName, Mustache.render(exp, window))
                    $el.removeAttr('data-eval');
                }
            }
        },

        // 适配f9中的response格式
        ajax: function(options) {
            var success = options.success;

            if (success) {
                options.success = null;
                delete options.success;
            }

            var settings = {
                type: 'post',
                dataType: 'json',
                cache: false,
                success: function(data, status, xhr) {
                    if (data.status) {
                        // 配置url则直接跳转
                        if (data.status.url) {
                            window.location.replace(data.status.url);
                        }
                    }
                    if (success) {
                        success.call(this, data.EpointDataBody ? data.EpointDataBody.DATA.UserArea : data.UserArea);
                    }

                },
                error: Util._ajaxErr
            };

            return $.ajax($.extend(settings, options));
        },
        // 动态加载js
        loadJs: function(url, callback) {
            var script = document.createElement("script");
            script.type = 'text/javascript';

            // IE8-
            if (callback) {
                if (script.readyState) {
                    script.onreadystatechange = function() {
                        if (script.readyState == 'loaded' || script.readyState == 'complete') {

                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                    // w3c
                } else {
                    script.onload = function() {
                        callback();
                        script.onload = null;
                    };
                };
            }

            script.src = SrcBoot.getPath(url);
            // append to head
            document.getElementsByTagName("head")[0].appendChild(script);
        },

        // 动态加载css
        loadCss: function(url) {
            var $link = $('<link/>', {
                href: SrcBoot.getPath(url),
                rel: 'stylesheet',
                type: 'text/css'
            });

            $link.appendTo(document.getElementsByTagName("head")[0]);
        },

        // src: tpl, css, js, callback
        loadPageSrc: function(src) {
            src.css && Util.loadCss(src.css);

            $.ajax({
                type: 'get',
                dataType: 'html',
                url: SrcBoot.getPath(src.tpl),
                success: function(html) {
                    $(html).appendTo('body');

                    Util.loadJs(src.js, src.callback);
                }
            });
        },

        // empty function
        noop: function() {},

        // 去除html标签中的换行符和空格
        clearHtml: function(html) {
            return html.replace(/(\r\n|\n|\r)/g, "")
                .replace(/[\t ]+\</g, "<")
                .replace(/\>[\t ]+\</g, "><")
                .replace(/\>[\t ]+$/g, ">");
        },

        _ajaxErr: function(jqXHR, textStatus, errorThrown) {
            console.error('status: %s, error: %s', textStatus, errorThrown);
            layer.close(loadIndex); //关闭加载层
        }
    });
}(jQuery));

// 加载共用代码片段
(function($) {
    var Include = function(cfg) {
        this.cfg = cfg;

        this._init();
    };

    Include.prototype = {
        constructor: Include,

        _init: function() {
            var c = this.cfg;

            if (c.async !== false) c.async = true;

            this.$container = $('#' + c.id);
        },

        fetch: function() {
            var c = this.cfg,
                self = this;

            return $.ajax({
                url: SrcBoot.getPath(c.src),
                type: 'GET',
                dataType: 'html',
                async: c.async,
                success: function(html) {
                    self.$container.html(html);

                    c.onload && c.onload(html);
                }
            });
        }
    };

    // 需要引入的代码片段
    var includes = [{
        id: 'header',
        src: 'pages/include/header.inc.html',
        onload: function() {
            Util.evalAttrs();
            activeNav();
            createselect();
            // console.log('...header loaded...');
        }
    }, {
        id: 'footer',
        src: 'pages/include/footer.inc.html',
        onload: function() {
            // console.log('...footer loaded...');
        }
    }];

    $.each(includes, function(i, cfg) {
        if ($('#' + cfg.id).length) {
            new Include(cfg).fetch();
        }
    });

    var activeNav = function() {
        var $nav = $('#navList'),
            $search = $("#hd-search"),
            $input = $('.search-txt', $search),
            $select = $('#TestSelect'),
            navlist = ["default", "caselib", "resourcelib"];
        var current = location.pathname.match(/\/pages\/(.+?)\//)[1];
        index = $.inArray(current, navlist);
        if (index < 0) {
            index = 0;
        }
        if (index === 2) {
            $select.empty().append('<option value="resourcelib">资源</option><option value="caselib">案例</option>');
            $input[0].placeholder = '资源关键字';
        }
        $('li', $nav).eq(index).addClass('active');
    }

    var createselect = function() {
        var $search = $("#hd-search"),
            $input = $('.search-txt', $search),
            $btn = $('.search-btn', $search),
            path = location.pathname.match(/\/pages\/(.+?)\//)[1];
        $("#TestSelect").chosen({
            disable_search: true
        }).change(function(event, opt) {
            var opt = opt.selected,
                falg = (opt === path ? true : false);
            $input.off('keypress');
            $btn.off('click');
            searchList($input, $btn, opt, falg);
            if (opt === 'caselib') {
                $input[0].placeholder = '项目关键字名称、编号...';
            } else {
                $input[0].placeholder = '资源关键字';
            }
        });
        searchList($input, $btn, path, true);
    }

    var searchList = function($input, $btn, opt, falg) {
        var loc;
        switch (opt) {
            case 'caselib':
                loc = '../caselib/case.html';
                break;
            case 'resourcelib':
                loc = '../resourcelib/standard.html';
                break;
            default:
                loc = '../caselib/case.html';
                break;
        }
        $btn.on('click', function() {
            var txt = $input.val()
            if (falg) {
                location.href = loc + "?keyWords=" + txt;
            } else {
                window.open(loc + "?keyWords=" + txt);
            }
        });

        //回车搜索
        $input.on('keypress', function(event) {
            var txt = $input.val() //搜索字段 
            if (event.keyCode == "13") {
                if (falg) {
                    location.href = loc + "?keyWords=" + txt;
                } else {
                    window.open(loc + "?keyWords=" + txt);
                }
            }
        });
    }

}(jQuery));

(function($) {

    $(function() {
        // placeholder
        if (!('placeholder' in document.createElement('input'))) {
            Util.loadJs('js/lib/jquery.placeholder.min.js', function() {
                $('input').placeholder();
            });
        }

        // 元素属性求值
        Util.evalAttrs();
    });

    if (window._settings) {
        _settings = $.extend(true, _settings.fe, _settings.be);
    }

}(jQuery));
