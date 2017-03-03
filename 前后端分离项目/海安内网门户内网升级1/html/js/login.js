/*!
 * 登录
 * author: chenxuan
 */

(function(win, $) {
    $("input[type='text']").placeholder();
    $("input[type='password']").placeholder();

    //设置背景图大小
    var $bg = $('#lay_bg'),
        $bg_img = $('#lay_bg_img');
    $(window).on("resize", function() {
        var $win = $(this);
        var cw = $win.width(),
            ch = $win.height(),
            iw = $bg_img.width(),
            ih = $bg_img.height();

        $bg.width(cw);
        $bg.height(ch);

        if (cw / ch > iw / ih) {
            var new_h = cw * ih / iw,
                    imgTop = (ch - new_h) / 2;
            $bg_img.width(cw);
            $bg_img.height(new_h);
            $bg_img.css({ "top": imgTop, "left": "" })
        } else {
            var new_w = ch * iw / ih,
                    imgLeft = (cw - new_w) / 2;
            $bg_img.width(new_w);
            $bg_img.height(ch);
            $bg_img.css({ "top": "", "left": imgLeft })
        }
    }).trigger("resize");
}(this, jQuery));
