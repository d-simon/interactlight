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
                if ((currentVideo !== video + '.mp4' && currentVideo !== video + '.ogv') || $videoBg.paused) {
                    BV.show(video + '.mp4', { ambient: true, altSource: video + '.ogv' });
                }
            };
        })();

        var stopVideo = function () {
            BV.getPlayer().pause();
        };

        $('.slide--home').waypoint(function () {
            changeVideo('media/DSC_2710');
        }, { offset: '-100%' });

        $('.slide--how-it-works').waypoint(function () {
            changeVideo('media/DSC_2756');
        }, { offset: '100%' });
        $('.slide--how-it-works').waypoint(function () {
            changeVideo('media/DSC_2756');
        }, { offset: '-100%' });

        $('.slide--tech').waypoint(function () {
            changeVideo('media/DSC_2760_dark');
        }, { offset: '100%' });
        $('.slide--tech').waypoint(function () {
            changeVideo('media/DSC_2760_dark');
        }, { offset: '-100%' });

        $('.slide--impressions').waypoint(function () {
            changeVideo('media/DSC_2725');
        }, { offset: '100%' });
        $('.slide--impressions').waypoint(function () {
            changeVideo('media/DSC_2725');
        }, { offset: '-100%' });

        $('.slide--code').waypoint(function () {
            stopVideo();
        }, { offset: '100%' });
        $('.slide--code').waypoint(function () {
            stopVideo();
        }, { offset: '-100%' });

    } else {
        $('html').addClass('no-videojs')
    }
});