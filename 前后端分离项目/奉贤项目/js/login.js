/*！
 * 奉贤项目-登录
 * date:2016-09-27
 * author: chenxuan;
 */
jQuery.support.cors = true;
(function(win, $) {
    var $name = $('#name-input'),
        $pwd = $('#pwd-input'),
        $submit = $('#btn-submit'),
        $goRegister = $('#to-register'),
        $goForget = $('#to-forget'),
        loginUrl = 'http://infx.fengxiannet.com/ajax/inter/Login.ashx';

    //登录
    $submit.click(function() {
        login();
    });
    //转跳注册
    $goRegister.click(function() {
        $.cookie('goto_register', true, { path: '/' });
        parent.location.reload();
    });
    //转跳忘记密码
    $goForget.click(function() {
        $.cookie('forget', true, { path: '/' });
        parent.location.reload();
    });

    //登录
    function login() {
        $.ajax({
            url: loginUrl,
            type: 'post',
            dataType: 'json',
            data: {
                Account: $name.val(),
                Pass: $pwd.val()
            },
            success: function(data) {
                var falg = data.success;
                if (falg) {
                    $.cookie('LoginInfo', JSON.stringify(data.result), { path: '/' });
                    layer.confirm("恭喜你，登录成功！", {
                        title: "提示信息",
                        icon: 1,
                        area: ['320px', ""],
                        btn: ['确定'],
                        skin: 'layer-ext-confirm'
                    }, function() {
                        parent.location.reload();
                    }, function() {

                    })

                } else {
                    var msg = data.msg;
                    layer.alert(msg, {
                        title: "提示信息",
                        icon: 0,
                        time: 2000,
                        area: ['320px', ""],
                        skin: 'layer-ext-alert'
                    })
                }
            },
            error: function() {
                console.log('接口不连通');
            }
        });
    };

}(this, jQuery));
