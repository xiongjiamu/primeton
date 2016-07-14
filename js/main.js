var slider = {
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch, //判断设备是否支持touch事件。
    slider: document.querySelector('.container'),
    variable: {
        clientHeight: document.documentElement.clientHeight,
        modLength: document.querySelectorAll('.mod').length,
        isScrolling: 0, //1为垂直划动，0为水平划动。
        isForward: 0, //1为向前翻页，0为向后翻页。
        mod_ind: 0,
        ctnLength: document.querySelectorAll('.ctn').length,
        ctnInd: 0
    },
    disable: [1],
    setFontSize: function() {
        var winWidth = $(window).width(),
            size = (winWidth / 640) * 100; //对640以上屏宽进行字体大小设置。
        document.documentElement.style.fontSize = (size < 100 ? size : 100) + 'px';
    },
    events: {
        slider: this.slider,
        handleEvent: function(event) {
            var self = this;
            if (event.type === 'touchstart') {
                self.start(event);
            } else if (event.type === 'touchmove') {
                self.move(event);
            } else if (event.type === 'touchend') {
                self.end(event);
            }
        },
        start: function(event) {
            var touch = event.targetTouches[0];
            startPos = {
                x: touch.pageX,
                y: touch.pageY
            };

            self.slider.slider.addEventListener('touchmove', this, false);
            self.slider.slider.addEventListener('touchend', this, false);
        },
        move: function(event) {
            if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
            var touch = event.targetTouches[0];
            endPos = {
                x: touch.pageX - startPos.x,
                y: touch.pageY - startPos.y
            };
            self.slider.variable.isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0; //1为纵向滑动，0为横向滑动；
            if (self.slider.variable.isScrolling === 1) {
                self.slider.variable.isForward = endPos.y < 0 ? 1 : 0;
            } else if (self.slider.variable.isScrolling === 0) {
                self.slider.variable.isForward = endPos.x > 0 ? 1 : 0;
            }
        },
        end: function(event) {
            if (self.slider.variable.isScrolling === 1 && self.slider.variable.isForward === 1) { //垂直向下滚动
                if (self.slider.variable.mod_ind !== 1 && (self.slider.variable.mod_ind !== self.slider.variable.modLength-1)) {
                    $('.mod').eq(self.slider.variable.mod_ind).animate({
                        top: -self.slider.variable.clientHeight
                    }, 'slow');
                    self.slider.variable.mod_ind = self.slider.variable.mod_ind <= self.slider.variable.modLength ? self.slider.variable.mod_ind + 1 : self.slider.variable.mod_ind;
                    $('.mod').eq(self.slider.variable.mod_ind).animate({
                        top: 0
                    }, 1800, 'linear', function() {
                        $('.blink').animate({
                            top: 36
                        }, 'slow');
                        $('.ctn').eq(0).animate({
                            opacity: 1
                        }, 'slow');
                        self.slider.events.click();
                    });
                } else {
                    return false;
                }
            }
        },
        click: function() {
            $('.btn').on('click', function() {
                if ($(this).parent().attr('class') !== 'ctn q') {
                    $(this).parent('.ctn').animate({
                        opacity: 0
                    }, 'slow');
                    $('.blink').animate({
                        top: self.slider.variable.clientHeight + 28
                    }, 'slow');
                    $('.vline').animate({
                        top: -28
                    }, 'slow', function() {
                        $('.blink').css('top', 0);
                        $('.blink').animate({
                            top: 56
                        }, 'slow', function() {
                            $('.ctn').eq(self.slider.variable.ctnInd).css('display', 'none');
                            self.slider.variable.ctnInd += 1;
                            $('.ctn').eq(self.slider.variable.ctnInd).animate({
                                opacity: 1
                            }, 'slow');
                        })


                    });
                } else {
                    if (self.slider.variable.ctnLength === (self.slider.variable.ctnInd + 1)) {
                        $('.mod').eq(self.slider.variable.mod_ind).animate({
                            top: -self.slider.variable.clientHeight
                        }, 'slow');
                        self.slider.variable.mod_ind += 1;
                        $('.mod').eq(self.slider.variable.mod_ind).animate({
                            top: 0
                        }, 'slow');
                    } else {
                        if ($(this).parent().find('.checked').length === 1) {
                            $(this).parent('.ctn').animate({
                                opacity: 0
                            }, 'slow');
                            $('.blink').animate({
                                top: self.slider.variable.clientHeight + 28
                            }, 'slow', function() {
                                $('.blink').css('top', 0);
                                $('.blink').animate({
                                    top: 56
                                }, 'slow', function() {
                                    $('.ctn').eq(self.slider.variable.ctnInd).css('display', 'none');
                                    self.slider.variable.ctnInd += 1;
                                    if ((self.slider.variable.ctnInd + 1) === self.slider.variable.ctnLength) {
                                        $('.vline').css('height', self.slider.variable.clientHeight - 50);
                                        $('.vline').addClass('last');
                                        $('.ctn').eq(self.slider.variable.ctnInd).animate({
                                            opacity: 1
                                        }, 'slow');
                                    }
                                })
                            })
                        }
                    }
                }


            })
        }
    },

    init: function() {
        var self = this;
        setTimeout(function() {
            self.setFontSize();
        }, 200);
        $('.mod').css('height', self.variable.clientHeight);
        $('.container').css('height', self.variable.clientHeight);
        $('.mod').eq(self.variable.mod_ind).animate({
            top: 0
        }, 'slow');
        $('.vline').css('height', self.variable.clientHeight);
        if (!!self.touch) {
            self.slider.addEventListener('touchstart', self.events, false);
        }
    }
};
slider.init();
$('.q').find('p').on('click', function() {
    $(this).addClass('checked').siblings().removeClass('checked');
    $(this).attr('checked', true).siblings().attr('checked', false);
});

