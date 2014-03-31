/* ====================================================================
        Section Resize
   ==================================================================== */

$(document).ready(function () {
    'use strict';

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