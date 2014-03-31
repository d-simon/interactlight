/* ====================================================================
        Navigation
   ==================================================================== */

$(document).ready(function () {
    'use strict';

    var $headNav = $('.head-nav'),
        $toggle = $headNav.find('.head-nav__menu-toggle');

    // http://css-tricks.com/snippets/jquery/calculate-distance-between-mouse-and-element/
    var mY, distance;

    function calculateDistanceY (elem, mouseY) {
        return Math.floor(mouseY - (elem.offset().top + (elem.height() / 2)));
    }

    // Visible Nav
    var navVisible = $.debounce(100, function (show) {
        if (show === true) {
            $headNav.addClass('visible').removeClass('hidden');
        } else {
            $headNav.addClass('hidden').removeClass('visible');
        }
    });


    // Handle Mouse Position
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

    // Handle Mouse Over/Leave
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