/* global $, Modernizr */

/* ====================================================================
        Section Resize
   ==================================================================== */


$(document).ready(function () {
    'use strict';

    window.viewportUnitsBuggyfill.init();

    if (Modernizr.cssvhunit === false || Modernizr.cssvwunit === false) {

        var sectionResize = (function () {
            var $main = $('.main'),
                $sectionsFull = $main.children('.js-fullHeight'),
                $sectionsMin = $main.children('.js-minHeight');

            return $.debounce(33, function () { // ~30 fps
                for (var i = 0; i < $sectionsFull.length; i++) {
                    $($sectionsFull[i]).css('height', $(window).height());
                }
                for (var i = 0; i < $sectionsMin.length; i++) {
                    $($sectionsMin[i]).css('min-height', $(window).height()*1.1);
                }
            });
        })();

        sectionResize();

        $(window).on('resize', sectionResize);
    }

});


/* ====================================================================
        Video
   ==================================================================== */

$(document).ready(function () {
    'use strict';

    var flash = false;
    if (typeof navigator.plugins !== "undefined" &&
        typeof navigator.plugins["Shockwave Flash"] === "object"
    ) {
        $('html').addClass('flash');
        flash = true;
    } else {
        $('html').addClass('no-flash');
    }

    if (!Modernizr.touch && Modernizr.video) {

        var $video = $('.video-bg'),
            BV = new $.BigVideo({
                container: $video,
                useFlashForFirefox:false
            });

        BV.init();
        BV.show('media/DSC_2710.mp4', { ambient: true, altSource: 'media/DSC_2710.ogv' });

        var changeVideo = (function () {
            var $videoBg = $video.find('video');

            return function (video) {
                var currentVideo = $videoBg.attr('src');
                if (currentVideo !== video + '.mp4' && currentVideo !== video + '.ogv') {
                    BV.show(video + '.mp4', { ambient: true, altSource: video + '.ogv' });
                }
            };
        })();

        $('.slide--home').waypoint(function () {
            changeVideo('media/DSC_2710');
        }, { offset: '-100%' });

        $('.slide--how-it-works').waypoint(function () {
            changeVideo('media/DSC_2756');
        }, { offset: '100%' });
        $('.slide--how-it-works').waypoint(function () {
            changeVideo('media/DSC_2756');
        }, { offset: '-100%' });

        $('.slide--snake').waypoint(function () {
            changeVideo('media/DSC_2725');
        }, { offset: '100%' });
        $('.slide--snake').waypoint(function () {
            changeVideo('media/DSC_2725');
        }, { offset: '-100%' });

        $('.slide--tech').waypoint(function () {
            changeVideo('media/DSC_2760_dark');
        }, { offset: '100%' });
        $('.slide--tech').waypoint(function () {
            changeVideo('media/DSC_2760_dark');
        }, { offset: '-100%' });

    } else {
        $('html').addClass('no-videojs')
    }
});


/* ====================================================================
        Navigation
   ==================================================================== */
    // http://css-tricks.com/snippets/jquery/calculate-distance-between-mouse-and-element/

$(document).ready(function () {
    'use strict';

    // instantiate Fast-Click
    if (Modernizr.touch) {
        FastClick.attach(document.body);
    }

    var mY, distance, $headNav = $('.head-nav');

    var $toggle = $headNav.find('.head-nav__menu-toggle');

    function calculateDistanceY (elem, mouseY) {
        return Math.floor(mouseY - (elem.offset().top + (elem.height() / 2)));
    }

    var navVisible = $.debounce(100, function (show) {
        if (show === true) {
            $headNav.addClass('visible').removeClass('hidden');
        } else {
            $headNav.addClass('hidden').removeClass('visible');
        }
    });


    // Handle Mouse
    var previousDistance = $(window).height();
    $(document).mousemove(function (e) {
        mY = e.pageY;
        distance = calculateDistanceY($headNav, mY);
        if (distance < 100 && previousDistance > $headNav.height() && $(window).scrollTop() > 0) {
            navVisible(true);
        } else if($(window).scrollTop() <= 0) {
            $headNav.removeClass('detached').removeClass('hidden').removeClass('visible');
        }
        previousDistance = distance;
    });

    var disableTimeout;
    $headNav.mouseover(function (e) {
        clearTimeout(disableTimeout);
    });
    $headNav.mouseleave(function (e) {
        if ($(window).scrollTop() > 0) {
            disableTimeout = setTimeout(function() {
                previousDistance = 0;
                navVisible(false);
            }, 500);
        }
        $toggle.prop('checked', false);
    });
    $headNav.find('.head-nav__menu label').mouseover(function (e) {
        $toggle.prop('checked', true);
    });

    // Handle Scrolling
    $(document).scroll(function (e) {
        if($(window).scrollTop() > 0) {
            if (!$headNav.hasClass('detached')) {
                $headNav.addClass('hidden');
            }
            $headNav.addClass('detached');
        } else {
            $headNav.removeClass('detached').removeClass('hidden').removeClass('visible');
        }
    });

    var previousScroll = 0;

    $(window).scroll(function (e) {
        var currentScroll = $(this).scrollTop();
        if (currentScroll > previousScroll && currentScroll > 0){
            // down
            navVisible(false);
        } else {
            // up
            navVisible(true);
        }
        previousScroll = currentScroll;
    });

    // Menu
    $headNav.find('.head-nav__menu-label').click(function (e) {
        e.preventDefault();
        $toggle.prop('checked', !$toggle.is(':checked'));
    })
    $('.head-nav__menu-list').children('li').click(function () {
        $toggle.prop('checked', false);
    });

    $toggle.change(function(){
        if($toggle.is(':checked')){
            $headNav.addClass('dark');
        } else {
            $headNav.removeClass('dark');
        }
    });
});
