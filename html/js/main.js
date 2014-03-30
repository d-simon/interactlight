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
    }
});


/* ====================================================================
        Navigation
   ==================================================================== */
    // http://css-tricks.com/snippets/jquery/calculate-distance-between-mouse-and-element/

$(document).ready(function () {
    'use strict';

    var mY, distance, $element = $('.head-nav');

    function calculateDistanceY (elem, mouseY) {
        return Math.floor(mouseY - (elem.offset().top + (elem.height() / 2)));
    }


    var navVisible = $.debounce(100, function (show) {
        if (show === true) {
            $element.addClass('visible').removeClass('hidden');
        } else {
            $element.addClass('hidden').removeClass('visible');
        }
    });

    var previousDistance = $(window).height();
    $(document).mousemove(function (e) {
        mY = e.pageY;
        distance = calculateDistanceY($element, mY);
        if (distance < 100 && previousDistance > 100 && $(window).scrollTop() > 150) {
            navVisible(true);
        } else if($(window).scrollTop() <= 150) {
            $element.removeClass('detached').removeClass('hidden');
        }
        previousDistance = distance;
    });

    $(document).scroll(function (e) {
        if($(window).scrollTop() > 150) {
            if (!$element.hasClass('detached')) {
                $element.addClass('hidden');
            }
            $element.addClass('detached');
        } else {
            $element.removeClass('detached').removeClass('hidden');
        }
    });

    var previousScroll = 0;

    $(window).scroll(function (e) {
        var currentScroll = $(this).scrollTop();
        if (currentScroll > previousScroll){
            // down
            navVisible(false);
        } else {
            // up
            navVisible(true);
        }
        previousScroll = currentScroll;
    });

    var disableTimeout;
    $element.mouseover(function (e) {
        clearTimeout(disableTimeout);
    });
    $element.mouseout(function (e) {
        if ($(window).scrollTop() > 150) {
            disableTimeout = setTimeout(function() {
                previousDistance = 0;
                navVisible(false);
            }, 500);
        }
    });

});
