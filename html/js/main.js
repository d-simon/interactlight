/* global $, Modernizr */
$(function() {
    'use strict';

/* ====================================================================
        Section Resize
   ==================================================================== */

    window.viewportUnitsBuggyfill.init();

    if (Modernizr.cssvhunit === false || Modernizr.cssvwunit === false) {

        var sectionResize = (function () {
            var $main = $('*[role="main"]'),
                $sectionsFull = $main.children('section.js-fullHeight'),
                $sectionsMin = $main.children('section.js-minHeight');

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


/* ====================================================================
        VIDEO
   ==================================================================== */

    if (!Modernizr.touch) {

        var BV = new $.BigVideo({
            container:$('#video-bg'),
            useFlashForFirefox:false
        });

        BV.init();
        BV.show('media/DSC_2710.mp4', { ambient: true, altSource: 'media/DSC_2710.ogv' });

        var changeVideo = (function () {
            var $videoBg = $('#video-bg').find('video');

            return function (video) {
                var currentVideo = $videoBg.attr('src');
                if (currentVideo !== video + '.mp4' && currentVideo !== video + '.ogv') {
                    BV.show(video + '.mp4', { ambient: true, altSource: video + '.ogv' });
                }
            };
        })();

        $('.home').waypoint(function() {
            changeVideo('media/DSC_2710');
        }, { offset: '-100%' });

        $('.how-it-works').waypoint(function () {
            changeVideo('media/DSC_2756');
        }, { offset: '100%' });
    }

});