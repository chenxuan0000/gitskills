/*!
 *图片轮播
 *author: xiaolong
 */

(function(win, $) {

    // 记录当前展示的图片id
    var curIndex = 0;

    var ScrollImg = function(options) {
        var defaults = {
            id: '',
            // 滚动区域宽度
            width: 680,
            // 滚动区域高度
            height: 320,
            // 自动播放
            autoPlay: true,
            // 滚动速度
            speed: 500,
            // 滚动图片切换间隔
            delay: 2000,
            // 小图数量
            showSize: 3,
            // 小图间距px
            smallPicspacing: 8
        };
this.options = $.extend({}, defaults, options);


        this.$newsImg = $('#' + this.options.id);

        // 大图集合容器
        this.$imgViewer = $(".img-viewer-cell", this.$newsImg);

        // 大图宽度
        this.bigImgWidth = this.$imgViewer.children().width();

        // 图片数量
        this.imgLength = this.$imgViewer.children().length;

        this.$imgViewer.width(this.imgLength * this.bigImgWidth);

        // 小图集合容器
        this.$smallImgViewer = $(".img-bars-content", this.$newsImg);

        // 小图高度
        this.smallImgHeight = this.$smallImgViewer.children().height() + this.options.smallPicspacing;

        // 上一个按钮
        this.$preButton = $(".pre-img", this.$newsImg);

        // 下一个按钮
        this.$nextButton = $(".next-img", this.$newsImg);

        // 大图文字链接
        this.$imgTitle = $(".img-title", this.$newsImg);

        // 定时器
        this.timer = null;

        this.$imgTitle.attr({
                    href: this.$imgViewer.children().eq(0).attr('href')
                });
        //console.log(this.$imgViewer.width());

        this._bindEvent();

        this._autoPlay();

    };

    $.extend(ScrollImg.prototype, {
        // 滚动
        _scroll: function(i, isResever) {

            

            if (i >= 0 && i < this.imgLength) {
                
                this.$imgViewer.css("left", -i * this.bigImgWidth + 'px');

                this.$smallImgViewer.children().eq(i)
                    .addClass('cur-span').siblings()
                    .removeClass('cur-span');
                
                // 小图滚动到大于可现实区域时整体滚动
                if (i > this.options.showSize-1 && isResever && this.$smallImgViewer.children().eq(i).position().top == this.smallImgHeight * this.options.showSize) {
                    //console.log(this.$smallImgViewer.children().eq(i).position().top)
                    this.$smallImgViewer.finish().animate({
                        marginTop: (this.options.showSize - 1- i) * this.smallImgHeight
                    }, this.options.speed);
                } else if(!isResever && i <= this.imgLength - this.options.showSize - 1 && this.$smallImgViewer.children().eq(i).position().top == -this.smallImgHeight){
                    this.$smallImgViewer.finish().animate({
                        marginTop: (- i) * this.smallImgHeight
                    }, this.options.speed);
                }

            } else if (i == this.imgLength) {

                curIndex = 0;

                this.$imgViewer.css("left", 0);

                this.$smallImgViewer.children().eq(0)
                    .addClass('cur-span').siblings()
                    .removeClass('cur-span');

                this.$smallImgViewer.finish().animate({
                    marginTop: 0
                }, this.options.speed);

                this.$imgTitle.html(this.$imgViewer.find('img').eq(0).attr('alt'));

                this.$imgTitle.attr({
                    href: this.$imgViewer.children().eq(0).attr('href')
                });

            } else if (i < 0) {

                //console.log(this.$smallImgViewer.children().eq(i).position().top);

                curIndex = this.imgLength - 1;

                this.$imgViewer.css("left", -(this.imgLength - 1) * this.bigImgWidth + 'px');

                this.$smallImgViewer.children().eq(this.imgLength - 1)
                    .addClass('cur-span').siblings()
                    .removeClass('cur-span');

                this.$smallImgViewer.finish().animate({
                    marginTop: (this.options.showSize - this.imgLength) * this.smallImgHeight
                }, this.options.speed);
            }

            this.$imgTitle.html(this.$imgViewer.find('img').eq(i).attr('alt'));

            this.$imgTitle.attr({
                    href: this.$imgViewer.children().eq(i).attr('href')
                });

        },

        // 定时播放
        _autoPlay: function() {
            var self = this;
            if (self.options.autoPlay) {

                self.timer = setTimeout(function() {
                    self.$nextButton.trigger("click");
                    self._autoPlay();
                }, self.options.delay);

            } else {
                return;
            }

        },

        // 绑定事件
        _bindEvent: function() {
            // 下一个按钮绑定事件
            var self = this;
            this.$nextButton.on('click', function(event) {

                /* Act on the event */
                if(self.$smallImgViewer.is(":animated")) {
                    return;
                } else {
                    self._scroll(++curIndex, true);
                }
                

            });

            // 上一个按钮绑定事件
            this.$preButton.on('click', function(event) {

                /* Act on the event */
                if(self.$smallImgViewer.is(":animated")) {
                    return;
                } else {
                    self._scroll(--curIndex);
                }
                

            });

            // 小图点击切换
            this.$smallImgViewer.on('click', '.img-bars-item', function(event) {

                /* Act on the event */
                var i = $(this).index();

                curIndex = i;

                // 
                var $offsetTop = $(this).position().top;


                if( $offsetTop == (self.options.showSize-1) * self.smallImgHeight && i < self.imgLength -1) {

                    self._scroll(i, true);

                    self.$smallImgViewer.finish().animate({
                        marginTop: (self.options.showSize - 2 - i) * self.smallImgHeight
                    }, self.options.speed);


                } else if ( $offsetTop == 0 && i > 0){

                    self._scroll(i); 

                    self.$smallImgViewer.finish().animate({
                        marginTop: ( 1 - i ) * self.smallImgHeight
                    }, self.options.speed);
                } else {

                    self._scroll(i);
                }


            });

            // 鼠标移上停止自动播放，放开继续自动播放
            this.$newsImg.on('mouseover', function(event) {

                /* Act on the event */
                clearTimeout(self.timer);

            }).on('mouseout', function(event) {

                /* Act on the event */
                self._autoPlay();

            });

        }

    });

    win.ScrollImg = ScrollImg;

}(this, jQuery));