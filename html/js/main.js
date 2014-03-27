$(function() {
    var BV = new $.BigVideo({
        container:$('section.home'),
    });
    BV.init();
    BV.show('media/DSC_2710_2.mp4', { ambient: true });
});