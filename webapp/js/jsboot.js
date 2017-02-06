// var MockUrl = "http://218.4.136.118:8086/mockjs/195/";
var MockUrl = "http://oa2.epoint.com.cn/SCKFrontService/appservice/";
SrcBoot.output((function () {
    var arr = [];

    arr.push('js/lib/jquery/' + (document.addEventListener ? 'jquery-2.2.3.min.js' : 'jquery-1.11.0.min.js'));

    // 对JSON API进行支持
    if (!window.JSON) {
        arr.push('js/lib/json3.min.js');
    }

    arr = arr.concat([
        'js/lib/chosen/chosen.jquery.min.js',
        'js/lib/layer/layer.js',
        'js/lib/mustache.js',
        'js/common.js'
    ]);

    return arr;
}()));
