;(function ($) {

    $.fn.slider = function (options) {        

        var settings = $.extend({            
            delay:  5000,
            duration: 500,
            offset: 0,
            current: 0,
            transition: "fade",
            auto: true,
            slider: ".slider",
            slide: ".slide",
            pager: ".pager",
            pagerTag: "a",
            pagerBuilder: "undefined",
            slideNext: ".next",
            slidePrev: ".prev",
            activeClass: "active",
            transparent: false            
        }, options);

        //support
        if (!$.support.transition) { $.fn.transition = $.fn.animate; }

        //setup
        var slider = $(this).find(settings.slider);
        var slides = $(this).find(settings.slide);        
        var pageNext = $(this).find(settings.slideNext);
        var pagePrev = $(this).find(settings.slidePrev);
        var pager = $(this).find(settings.pager);
        var curr = settings.current;
        var next = curr;        
        var sliding = false;
        var interval = setInterval(function () { sliderTransition(); }, settings.delay);
        if(!settings.auto) { clearInterval(interval); }
        slides.hide().first().show();

        //controls
        slides.each(function (index) {
            if (typeof settings.pagerBuilder !== 'undefined' && $.isFunction(settings.pagerBuilder)) { pager.append(settings.pagerBuilder(index)); }            
            else { pager.append('<'+settings.pagerTag+'></'+settings.pagerTag+'>'); }            
        });
        pager.find(settings.pagerTag).first().addClass(settings.activeClass);
        
        pager.on('click', settings.pagerTag, function () {
            if ($(this).index() != curr) {
                sliderTransition($(this).index());
            }
        });

        pagePrev.on('click', function () {
            if (!sliding) {
                next = curr;
                sliderTransition(--next, false);
            }
        });

        pageNext.on('click', function () {
            if (!sliding) {
                next = curr;
                sliderTransition(++next, true);
            }
        });

        if(slides.length < 2) {       
            pagePrev.hide();
            pageNext.hide();
            pager.hide();
            clearInterval(interval);
        }

        //slides
        function sliderTransition(skip, forward) {
            if (!sliding) {
                //set next slide
                sliding = true;
                clearInterval(interval);
                if (forward == null) { forward = true; }
                if (skip != null) { next = skip; }
                else { ++next; }
                if (next >= slides.length) { next = 0; }
                else if (next < 0) { next = slides.length - 1; } 

                //slider setup
                pager.find(settings.pagerTag).removeClass(settings.activeClass);
                pager.find(settings.pagerTag+':nth-child(' + (next + 1) + ')').addClass(settings.activeClass);

                if(settings.transition == 'slide') {

                    var w = slides.eq(curr).width();
                    var h = slides.eq(curr).height();
                    slider.attr('style', 'width:' + w + 'px; height:' + h + 'px; position: relative; overflow: hidden;');
                    slides.attr('style', 'display:none; position:absolute; width:100%;');
                    slides.eq(curr).css('left', '0px').show();
                    slides.eq(next).css('left', ((forward) ? '' : '-') + (w + settings.offset) + 'px').show();

                    slides.eq(curr).transition({ left: ((forward) ? '-' : '') + w + 'px' }, settings.duration, 'easeInOutQuad', function () {
                        slides.eq(curr).attr('style', 'position:relative;').hide();
                    });
                    slides.eq(next).transition({ left: '0px' }, settings.duration, 'easeInOutQuad', function () {
                        slider.attr('style', 'position:relative;');
                        slides.eq(next).attr('style', 'position:relative; display:block;');
                        curr = next;
                        sliding = false;
                        if (settings.auto) { interval = setInterval(function () { sliderTransition(); }, settings.delay); }
                    });                    
                }
                else
                {
                    slider.attr('style', 'height:' + slider.height() + 'px; position:relative; z-index:1;');
                    slides.attr('style', 'display:block; opacity:0; z-index:0; position:absolute; left:0; top:0; right:0; bottom:0;');
                    slides.eq(curr).css('zIndex', '1').css('opacity', '1');
                    slides.eq(next).css('zIndex', '2').css('opacity', '0');
                    
                    if (settings.transparent) { slides.eq(curr).transition({ opacity: 0 }, settings.duration, 'easeInOutQuad'); }
                    slides.eq(next).transition({ opacity: 1 }, settings.duration, 'easeInOutQuad', function () {                    
                        curr = next;
                        sliding = false;
                        slider.attr('style', 'position:relative; z-index:1;');
                        slides.eq(curr).attr('style', 'position:relative; display:block; opacity:1; z-index:2;');
                        if (settings.auto) { interval = setInterval(function () { sliderTransition(); }, settings.delay); }
                    });
                }
            }
        }

        return this;

    };

}(jQuery));
