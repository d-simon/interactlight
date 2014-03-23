var i2p = require('image2pixels')
  , util = require('./util.js');

function Images (pixelScreen, files) {
    this.pixelScreen = pixelScreen;
    this.files = files;
}

Images.prototype.showImageSafe = function (str, callback) {
    var that = this;
    // Safe Delay for Artnet
    setTimeout(function () {
        that.showImage(str, callback);
    },50);
};

Images.prototype.showImage = function (str, callback) {
    var fileStr = '';
    var that = this;

    for (var file in this.files) {
        if (file === str) {
            fileStr = this.files[file];
            break;
        }
    }
    if (fileStr.length) {
        i2p(fileStr, { pixelsCallback: util.convertI2PtoPixelScreen }, function (err, pixels) {
            that.pixelScreen.update(pixels);
            if (typeof callback === 'function') callback(null, pixels);
        });
    } else {
        if (typeof callback === 'function') callback(new Error('Not Found!'), null);
    }
};

module.exports = Images;