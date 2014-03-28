/* global $ */
$(function() {
'use strict';

    var options = {
        scrollBy: 200,
        speed: 200,
        easing: 'easeOutQuart',
        scrollBar: '#scrollbar',
        activatePageOn: 'click',
        dynamicHandle: 1,
        dragHandle: 1,
        clickBar: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1
    };
    var frame = new Sly('#frame', options);

    if (!Modernizr.touch) {
        // Fix this?
        setTimeout(function () {
            // Initiate frame
            frame.init();
        }, 200);
    }
    // Reload on resize
    $(window).on('resize', frame.reload);

    var toggleAnimationLoop = (function () {
        var loopId;
        var speed = 100;

        return function () {
            if (loopId) {
                loopId = clearTimeout(loopId);
                frame.set(options);
            } else {
                var i = 0;
                frame.set('easing', 'linear');
                frame.set('speed', speed);
                (function loop() {
                    i++;
                    loopId = setTimeout(loop, speed);
                    frame[i % 2 === 0 ? 'toStart' : 'toEnd']();
                } ());
            }
        };
    })();

    var sectionResize = (function () {
        var $main = $('*[role="main"]'),
            $sectionsFull = $main.children('section.js-fullHeight'),
            $sectionsMin = $main.children('section.js-minHeight');

        return $.debounce(16, function () { // 60 fps
            for (var i = 0; i < $sectionsFull.length; i++) {
                $($sectionsFull[i]).css('height', $(window).height());
                console.log($(window).height());
            }
            for (var i = 0; i < $sectionsMin.length; i++) {
                $($sectionsMin[i]).css('min-height', $(window).height()*1.1);
                console.log($(window).height());
            }
        });
    })();

    sectionResize();

    $(window).on('resize', sectionResize);


    var BV = new $.BigVideo({
        container:$('#video-bg')
    });

    if (!Modernizr.touch) {
        BV.init();
        //BV.show('media/DSC_2710.mp4', { ambient: true });
        BV.show('media/DSC_2756.mp4', { ambient: true });
    }


});