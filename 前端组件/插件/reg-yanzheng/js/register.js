/**!
 * 用户注册
 * author: shenyh
 * date:2016.12.13
 */

(function(win, $) {

    $('[placeholder]').placeholder();

    var $registerForm = $('#registerForm'),
        $weakPwd = $('.ewb-weak', $registerForm),
        $mediumPwd = $('.ewb-medium', $registerForm),
        $strongPwd = $('.ewb-strong', $registerForm),
        $delPwd = $('.ewb-form-safe span', $registerForm),
        $submitBtn = $('.ewb-form-btn', $registerForm),
        $input=$('.ewb-form-row input',$registerForm);

    // 验证成功后
    $.validator.setDefaults({
        submitHandler: function() {
            alert("提交事件!");
            $input.val("");
        }
    });


    /*  添加自定义校验 */

    // 手机号码和固话规则
    $.validator.addMethod('isPhone', function(value, element) {
        var length = value.length;
        var mobile = /^1[34578]\d{9}$/;
        var tel = /0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}/;
        return this.optional(element) || (tel.test(value) || mobile.test(value));
    }, '请正确填写您的联系电话');

    // 用户名支持字母、数字、下划线组合，需以字母开头
    $.validator.addMethod('isUser', function(value, element) {
        var length = value.length;
        var username = /^[a-zA-Z]+[a-zA-Z0-9_]*$/;
        return this.optional(element) || username.test(value);
    }, '需字母开头,数字和下划线');

    // 密码不能有空格
    $.validator.addMethod('isPwd', function(value, element) {
        var length = value.length;
        var passWord = /^\S*$/;
        return this.optional(element) || passWord.test(value);
    }, '密码不能有空格');

    // 身份证号码
    $.validator.addMethod('isCard', function(value, element) {
        var length = value.length;
        var card = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return this.optional(element) || card.test(value);
    }, '密码不能有空格');


    //密码强度验证
    $('#password').on('keydown', function() {

        var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        var weakRegex = new RegExp("(?=.{6,}).*", "g");

        if (false == weakRegex.test($(this).val())) {
            $delPwd.removeClass('cur');
            //密码小于六位的时候，密码强度图片都为灰色 
        } else if (strongRegex.test($(this).val())) {
            $delPwd.removeClass('cur');
            $strongPwd.addClass('cur');
            //密码为八位及以上并且字母数字特殊字符三项都包括,强度最强 
        } else if (mediumRegex.test($(this).val())) {
            $delPwd.removeClass('cur');
            $mediumPwd.addClass('cur');
            //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等 
        } else {
            $delPwd.removeClass('cur');
            $weakPwd.addClass('cur');
            //如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的 
        }
        return true;
    });



    // 表单验证规则
    var validator = $registerForm.validate({
        rules: {
            userName: {
                required: true,
                isUser: true,
                rangelength: [3, 20]
            },
            password: {
                required: true,
                isPwd: true,
                minlength: 6,
                maxlength: 20
            },
            confirmpwd: {
                required: true,
                isPwd: true,
                minlength: 6,
                maxlength: 20,
                equalTo: "#password"
            },
            contacts: "required",
            mobile: {
                required: true,
                isPhone: true
            },
            phone: {
                required: true,
                isPhone: true
            },
            QQ: {
                required: true,
                digits: true
            },
            email: {
                required: true,
                email: true
            },
            identity: {
                required: true,
                isCard: true
            },
            agree:"required",
            topic: {
                required: "#agree:checked",
                minlength: 2
            }

        },
        messages: {
            userName: {
                required: "请输入用户名",
                rangelength: "用户名为3-20个字符"
            },
            password: {
                required: "请输入密码",
                minlength: "密码最少6个字符",
                maxlength: "密码最多20个字符"
            },
            confirmpwd: {
                required: "请输入确认密码",
                minlength: "密码最少6个字符",
                maxlength: "密码最多20个字符",
                equalTo: "两次输入密码须一致"
            },
            contacts: "请输入联系人",
            mobile: {
                required: "请输入联系电话"
            },
            phone: {
                required: "请输入固定电话"
            },
            QQ: {
                required: "请输入QQ号",
                digits: "请输入正确的QQ号"
            },
            email: {
                required: "请输入email",
                email: "请输入正确的eamil"
            },
            identity: {
                required: "请输入身份证号码",
                isCard: "请输入正确的身份证号码"
            },
            agree: "请勾选",
            topic: "请选择两个主题"
        }
    });



}(this, jQuery))
