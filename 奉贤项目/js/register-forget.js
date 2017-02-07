/*！
 * 奉贤项目-注册-忘记密码
 * date:2016-09-27
 * author: chenxuan;
 */
jQuery.support.cors = true;
(function(win, $) {
    var $register = $('#register'),
        $name = $('.name-input', $register),
        $code = $('.code', $register),
        $send1 = $('.send-msg', $register),
        $pwd = $('.pwd-input', $register),
        $sure = $('.re-pwd', $register),
        $submit1 = $('.submit', $register),
        $forget = $('#forget'),
        $name2 = $('.name-input', $forget),
        $code2 = $('.code', $forget),
        $send2 = $('.send-msg', $forget),
        $pwd2 = $('.pwd-input', $forget),
        $sure2 = $('.re-pwd', $forget),
        $submit2 = $('.submit', $forget),
        resCodeUrl = 'http://infx.fengxiannet.com/ajax/inter/RegCode.ashx', //注册验证码地址
        forCodeUrl = 'http://infx.fengxiannet.com/ajax/inter/PassCode.ashx', //忘记密码验证码地址
        resUrl = 'http://infx.fengxiannet.com/ajax/inter/Registered.ashx', //注册接口
        changeUrl = 'http://infx.fengxiannet.com/ajax/inter/PassUpdate.ashx'; //修改密码

    //注册
    $submit1.click(function() {
        var res = $name.val(),
            code = $code.val(),
            pwd = $pwd.val(),
            sure = $sure.val(),
            para = {
                Account: res,
                Pass: pwd,
                Code: code
            };
        //先判断2个密码是否相同
        if (sure != pwd) {
            sendLayer('2次密码输入不一致', 5);
        } else {
            submit(para, resUrl, '注册成功');
        }
    });

    //修改密码
    $submit2.click(function() {
        var res = $name2.val(),
            code = $code2.val(),
            pwd = $pwd2.val(),
            sure = $sure2.val(),
            para = {
                Account: res,
                Pass: pwd,
                Code: code
            };
        //先判断2个密码是否相同
        if (sure != pwd) {
            sendLayer('2次密码输入不一致', 5);
        } else {
            submit(para, changeUrl, '修改成功');
        }
    });

    // 验证码倒计时
    var t = 60,
        timer;
    var setTime = function() {
        if (t === 60) {
            sendMsg($name.val(), resCodeUrl, $send1); //注册 发送短信
        }
    }

    var setTime2 = function() {
            if (t === 60) {
                sendMsg($name2.val(), forCodeUrl, $send2); //注册 发送短信
            }
        }
        //改变发送按钮的状态
    function changeState($send) {
        $send.html(t + "s").css('cursor', 'default');
        if (t == 0) {
            clearTimeout(timer);
            t = 60;
            $send.html('重新发送').css('cursor', 'pointer');
            $send.on('click', setTime);
            return false;
        }
        $send.off('click', setTime);
        timer = setTimeout(function() {
            changeState($send);
        }, 1000);
        t--;
    };
    $send1.on('click', setTime); //发送注册验证码
    $send2.on('click', setTime2); //发送忘记密码验证码

    //发送验证码
    function sendMsg(name, url, $send) {
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: { Account: name },
            success: function(data) {
                var success = data.success,
                    msg = data.msg;
                if (success) {
                    changeState($send);
                    var Msg = '发送验证码成功';
                    sendLayer(Msg, 6);
                } else {
                    var Msg = msg;
                    sendLayer(Msg, 5);
                }
            },
            error: function() {
                console.log('接口不连通');
            }
        });
    };

    //注册
    function submit(para, url, successInfo) {
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: para,
            success: function(data) {
                var success = data.success,
                    msg = data.msg;
                if (success) {
                    var Msg = successInfo;
                    sendLayer(Msg, 6);
                    parent.location.reload();
                } else {
                    var Msg = msg;
                    sendLayer(Msg, 5);
                }
            },
            error: function() {
                console.log('接口不连通');
            }
        });
    };

    function sendLayer(Msg, i) {
        layer.alert(Msg, {
            title: "提示信息",
            icon: i,
            time: 2000,
            area: ['320px', ""],
            skin: 'layer-ext-alert'
        })
    };

}(this, jQuery));
