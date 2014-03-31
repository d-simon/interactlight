/* ====================================================================
        Main
   ==================================================================== */

$(document).ready(function () {
    'use strict';

    // viewport
    window.viewportUnitsBuggyfill.init();

    // instantiate Fast-Click
    if (Modernizr.touch) {
        FastClick.attach(document.body);
    }

});