// 'http://32.129.22.108:8080/oarest/rest/oa/'

var http = "http://32.129.22.108:8080/oarest/rest/oa/",
    http1 = "http://32.129.22.108:8080/oarest/rest/oaha/",
    logoOut = "http://32.129.22.108:8080/cas3/logout?service=http://32.129.22.108:8080/haweb/";
    CurrToken = "",
    CurrUserGuid = "";
// 对应的栏目guid
var categoryGuid = {
    "columninfo": "9cf4e924-1d84-4c86-afb2-9b63e01d2a82", //内刊信息
    "normaldl": "e5823db4-84e6-4dcb-ba99-a86d619186b2", //系统帮助
    "notice2": "10b260cd-b9dd-4487-b9ff-c994160b46b7", //通知公告
    "deptstate": "a280c80f-42f7-42a2-ae84-46066d226491", //部门动态
    "innerinfo": "9cf4e924-1d84-4c86-afb2-9b63e01d2a82", //最新内刊
    "haianstate": "6eee06f0-9bf6-497a-a193-03ebd14a1ef2", //海安动态
    "trainmaterials": "80aead8e-9026-4710-82d8-2f4287522607",//培训资料
    "software": "e5823db4-84e6-4dcb-ba99-a86d619186b2",//常用软件
    "drivedown": "9d248dd1-bcca-45f3-a952-98130061969a",//驱动下载
    "onlineanswer": "a3cdd780-57a7-4eb6-997d-1592fff91deb"//讨论区
};


// 部署到正式环境，需要调整这个地方的地址
var SOAJumpToWebFrontUrl = "http://32.129.22.108:8080/cas3/login?service=http://32.129.22.108:8080/haweb/";

function getScript(url, func, customparam) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = url;

    script.onload = script.onload = function(data) {
        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
            func(data, customparam);
            script.onload = script.onreadystatechange = null;
        }
    };
    head.appendChild(script);
}
$(document).ready(function() {
    //初始化当前登录用户的信息，获取OA服务调用的Token（ValidateData） 部署到正式环境，需要调整这个地方的地址
    $.getScript("http://32.129.22.108/EpointASP/createToken.jspx", function(data) {   
        if (window.currentinfo === undefined) {
            window.location = SOAJumpToWebFrontUrl;
        } else {
            if (currentinfo.token && currentinfo.UserGuid) {
                $('#topdiv').hide();
                CurrToken = currentinfo.token;
                CurrUserGuid = currentinfo.UserGuid;
                if (PageLoad) {
                    PageLoad(CurrUserGuid, CurrToken);
                }
            } else {
               window.location = SOAJumpToWebFrontUrl;
            }
        }
    });
});


// 导航栏链接填充
(function(win, $) {
    var $nav = $('#ewb-nav a');
    $nav.each(function() {
        var name = $(this).attr('class');
        type = typeof(name);
        if (type === 'string') {
            $(this).attr('href', "about.html?CategoryGuid=" + categoryGuid[name]);
        }
    });
    //获取当前时间
    var myDate = new Date(),
        year = myDate.getFullYear(),
        month = myDate.getMonth() + 1,
        date = myDate.getDate(),
        day = myDate.getDay(),
        week = ["日", "一", "二", "三", "四", "五", "六"],
        sysTime = year + "年" + month + "月" + date + "日 星期" + week[day];
    $('#sysTime').empty().html(sysTime);
}(this, jQuery));

// 工具方法
(function($) {
    if (!window.Util) {
        window.Util = {};
    }

    $.extend(Util, {
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
                success: function(data, status, xhr) {
                    if (data.status) {
                        // 配置url则直接跳转
                        if (data.status.url) {
                            window.location.replace(data.status.url);
                        }
                    }
                    if (success) {
                        success.call(this, data.UserArea ? data.UserArea : data, status, xhr);
                    }

                },
                error: Util._ajaxErr
            };

            return $.ajax($.extend(settings, options));
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
        }

    });
}(jQuery));
