// 默认第二层为根路径 
// 如localhost/f9 f9即对应项目根目录webapp
jQuery.support.cors = true; //支持跨服务器请求
var M = Mustache,
    html = [],
    loadIndex,
    info = $.cookie('LoginInfo'),
    defaultIcon = 'http://infx.fengxiannet.com/images/touxiang.jpg'; //默认头像地址
defaultImage = 'http://infx.fengxiannet.com/Download/sompany/cut/test636065924918616285.jpg'; //默认头像地址
httpImg = 'http://infx.fengxiannet.com'; //图片地址前缀
if (info != undefined) {
    info = JSON.parse(info);
}
//用户id判断。 登录状态下获取 
if (info) {
    loginId = info.ID; //用户id
} else {
    loginId = null;
}
//遮住层 缓冲
loadIndex = layer.load(1, {
    scrollbar: false,
    shade: [0.8, '#000'],
    shift: 5
});
//栏目分类数组
var Columnarr1 = [8, 10, 14], //新闻详细页面  活动专题
    Columnarr2 = [12, 13], //问卷答题详细页面
    Columnarr3 = 11, //投票详细页面
    Columnarr4 = [1, 2, 3, 4, 5, 7, 15], //生活详细页面
    Columnarr5 = 6, //电影
    Columnarr6 = 9; //行摄
//我的评论页面 链接地址配置 
var mycommonUrl = {
    news: '../news/xinwen-xiangqing.html', //新闻详细页面  活动专题
    wenjuan: '../news/xinwen-xiangqing.html', //问卷答题详细页面
    toupiao: '../news/xinwen-xiangqing.html', //投票详细页面
    life: '../news/xinwen-xiangqing.html', //生活详细页面
    film: '../news/xinwen-xiangqing.html', //电影详细页面
    xinshe: '../news/xinwen-xiangqing.html' //行摄详细页面
};
var _rootPath = (function() {
    var path = location.pathname;

    if (path.indexOf('/') == 0) {
        path = path.substring(1);
    }

    return '/' + path.split('/')[0];
}());

// ★前端开发目录★，如 var _basePath = _rootPath + '/Project';这里的“Project”根据项目组放置本框架的目录进行更改，为访问路径第二层开始至pages;
var _basePath = _rootPath + '';

var SrcBoot = {
    // 获取资源全路径
    getPath: function(path) {
        // 全路径
        if (/^(http|https|ftp)/g.test(path)) {
            return path;
        }

        // 用于测试本地mockjs测试用例js，约定以_test最为前缀，debug为false时不在页面输出
        if (path.indexOf('_test') != -1 && !this.debug) {
            return false;
        }

        // 是否是相对路径
        var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;

        path = (isRelative ? '' : (_basePath + '/')) + path;

        return path;
    },
    // 这个debug是针对mock测试而言的
    debug: true
};


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
        //拼接Images地址
        changeImagesUrl: function(len, result, url) {
            for (var i = 0; i < len; i++) {
                var res = result[i].Images;
                if (res.length != 0) {
                    result[i].Images = httpImg + result[i].Images;
                } else {
                    result[i].Images = url;
                }
            }
        },
        //拼接Image1地址
        changeImage1Url: function(len, result, url) {
            for (var i = 0; i < len; i++) {
                var res = result[i].Image1;
                if (res.length != 0) {
                    result[i].Image1 = httpImg + result[i].Image1;
                } else {
                    result[i].Image1 = url;
                }
            }
        },
        //拼接Image地址
        changeImageUrl: function(len, result, url) {
            for (var i = 0; i < len; i++) {
                var res = result[i].Image;
                if (res.length != 0) {
                    result[i].Image = httpImg + result[i].Image;
                } else {
                    result[i].Image = url;
                }
            }
        },
        //判断信息所属的类型(详细页面地址)
        returnUrl: function(type) {
            var getState = function(type, arr) {
                return $.inArray(type, arr) === -1 ? false : true;
            };
            if (getState(type, Columnarr1)) {
                return mycommonUrl.news;
            } else if (getState(type, Columnarr4)) {
                return mycommonUrl.life;
            } else if (getState(type, Columnarr2)) {
                return mycommonUrl.wenjuan;
            } else if (type == 11) {
                return mycommonUrl.toupiao;
            } else if (type == 6) {
                return mycommonUrl.film;
            } else {
                return mycommonUrl.xinshe;
            }
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

        fetch: function(i) {
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
        src: '../include/header.inc.html',
        onload: function() {
            Util.evalAttrs();
            headClick();
            // console.log('...header loaded...');
        }
    }, {
        id: 'footer',
        src: '../include/footer.inc.html',
        onload: function() {
            // console.log('...footer loaded...');
        }
    }];

    $.each(includes, function(i, cfg) {
        if ($('#' + cfg.id).length) {
            new Include(cfg).fetch();
        }
    });

    function headClick() {
        //判断登录状态
        var $no = $('#no-login'),
            $has = $('#has-login');
        if (info) {
            //登录状态
            var name = info.Name,
                img = info.Images;
            if (img.length != 0) {
                img = httpImg + img;
            } else {
                img = 'http://infx.fengxiannet.com/images/touxiang.jpg';
            }
            if (name.length === 0) {
                name = '火星网友';
            }
            $no.hide();
            $has.show();
            $has.find('.login-name').empty().html(name).end().find('.login-img').attr('src', img);
        } else {
            //点击爆料判断
            $('#baoliao-a').click(function() {
                layer.open({
                    type: 2,
                    title: "登录",
                    area: ['520px', '450px'],
                    content: '../index/login.html',
                    skin: 'layer-ext-alert'
                });
            });
        }

        //签到
        $has.find('.span2').click(function() {
            signup();
        });

        function signup() {
            $.ajax({
                url: 'http://infx.fengxiannet.com/ajax/Inter/SignIn.ashx',
                type: 'post',
                dataType: 'json',
                data: { id: loginId },
                success: function(data) {
                    var signState = data.success;
                    if (signState) {
                        Msg = '签到成功';
                        signLayer(Msg);
                    } else {
                        Msg = data.msg;
                        signLayer(Msg);
                    }

                    function signLayer(Msg) {
                        layer.alert(Msg, {
                            title: "提示信息",
                            time: 2000,
                            icon: 6,
                            area: ['320px', ""],
                            skin: 'layer-ext-alert'
                        })
                    };
                },
                error: function() {
                    console.log('接口不连通');
                }
            });
        }

        //消息
        $has.find('.span3').click(function() {
            window.open('../percenter/per-jifen-xiaoxi.html?id=' + loginId);
        });
        //注销
        $has.find('.span4').click(function() {
            layer.confirm("确定退出登录？", {
                title: "提示信息",
                icon: 3,
                area: ['340px', ""],
                btn: ['确定', '取消'],
                skin: 'layer-ext-confirm'
            }, function() {
                $.cookie('LoginInfo', null, { path: '/' });
                parent.location.reload();
            }, function() {

            })
        });

        //搜索
        var $search = $('#search'),
            $btn = $('#searchBtn'),
            searchHref = 'search.html';
        //点击搜索
        $btn.on('click', function() {
            var title = $search.val(); //搜索字段 全局
            window.open('../index/search.html?Title=' + title);
        });

        //回车搜索
        $search.on('keypress', function(event) {
            var title = $search.val(); //搜索字段 全局
            if (event.keyCode == "13") {
                window.open('../index/search.html?Title=' + title);
            }
        });

        var goRegister = $.cookie('goto_register'),
            goForget = $.cookie('forget');
        //登录
        $('#login-per').click(function() {
            layer.open({
                type: 2,
                title: "登录",
                area: ['520px', '450px'],
                content: '../index/login.html',
                skin: 'layer-ext-alert'
            });
        });

        //注册
        $('#zhuce-per').click(function() {
            openRegister('注册', '../index/register.html');
        });

        if (goRegister === 'true') {
            openRegister('注册', '../index/register.html');
            $.cookie('goto_register', null, { path: '/' });
        };
        if (goForget === 'true') {
            openRegister('密码找回', '../index/forget-pwd.html');
            $.cookie('forget', null, { path: '/' });
        };

        //打开注册 活忘记密码
        function openRegister(str, url) {
            layer.open({
                type: 2,
                title: str,
                area: ['605px', '550px'],
                content: url,
                skin: 'layer-ext-alert'
            });
        };

        $(".weixin>span").click(function() {
            $(this).parent(".weixin").hide();
        });
        $('input').placeholder(); //placeholder

    };

}(jQuery));
