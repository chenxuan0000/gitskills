(function(win, $) {
    var $btn = $('#button'),
        layer = $('#cityCon').html(),
        screenWidth = window.innerWidth,
        screenHeight = window.innerHeight;
    var layerHtml = '<div class="layui-layer-shade" id="layer">' + '<div class="layer-div">' + '<div class="layer-hd clearfix"><h5 class="l">弹窗实例</h5><span class="close r" id="close">x</span></div>' + '<div class="layer-bd">' + layer + '</div>' + '</div>' + '</div>';
    $btn.click(function() {
        $('body').append(layerHtml);
        var $layer = $('#layer'),
            $layerDiv = $layer.find('.layer-div'),
            layerHeight = $layerDiv.height(),
            layerWidth = $layerDiv.width();
        $layerHd = $layer.find('.layer-hd');
        $layer.fadeIn();

        $('#close').click(function() {
            $layer.fadeOut();
        })
        var canFollow = false,
            offsetX, offsetY;
        var layerMove = function(e) {
            var x = e.clientX + document.body.scrollLeft - document.body.clientLeft,
                y = e.clientY + document.body.scrollTop - document.body.clientTop,
                offsetX2 = screenWidth - layerWidth + offsetX,
                offsetY2 = screenHeight - layerHeight + offsetY,
                Left, Right, Top, Bottom;
            if (x < offsetX) {
                Left = 0;
                Top = (y - offsetY) + "px";
                if (y < offsetY) {
                    Left = 0;
                    Top = 0;
                }
                if (y > offsetY2) {
                    Left = 0;
                    Bottom = 0;
                    Top = 'auto';
                }
            } else if (x > offsetX2) {
                Left = 'auto';
                Right = 0;
                Top = (y - offsetY) + "px";
                if (y <= offsetY) {
                    Top = 0;
                }
                if (y > offsetY2) {
                    Top = 'auto';
                    Bottom = 0;
                }
            } else if (y > offsetY2) {
                Left = (x - offsetX) + "px",
                    Top = 'auto',
                    Bottom = 0;
            } else if (y < offsetY) {
                Left = (x - offsetX) + "px";
                Top = 0;
            } else {
                Left = (x - offsetX) + "px";
                Top = (y - offsetY) + "px";
            }
            $layerDiv.css({
                "left": Left,
                "top": Top,
                "bottom": Bottom,
                "right": Right
            });
        };
        var selectstart = function(e) {
            return false;
        }
        // 跟随鼠标移动
        $layerHd.on('mousedown', function(e) {
            var $this = $(this),
                offset = $this.offset(),
                x = e.clientX + document.body.scrollLeft - document.body.clientLeft,
                y = e.clientY + document.body.scrollTop - document.body.clientTop;
            offsetX = x - offset.left;
            offsetY = y - offset.top;
            $layerHd.on('mousemove', layerMove);
            $layerDiv.on('selectstart', selectstart);
            canFollow = true;
        }).on('mouseleave', function(e) {
            $layerHd.off('mousemove');
            if (canFollow) {
                $layer.on('mousemove', layerMove);
            }
        }).on('mouseenter', function() {
            $layerHd.on('mousemove');
        }).on('mouseup', function() {
            canFollow = false;
            $layerHd.off('mousemove');
            $layer.off('mousemove');
            $layerDiv.off('selectstart');
        });
    })
}(this, jQuery));
