var i2p = require('image2pixels');

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

    for (file in this.files) {
        if (file === str) {
            fileStr = this.files[file];
            break;
        }
    }
    if (fileStr.length) {
        i2p(fileStr, { pixelsCallback: this.convertI2PtoPixelScreen }, function (err, pixels) {
            that.pixelScreen.update(pixels);
            if (typeof callback === 'function') callback(null, pixels);
        });
    } else {
        if (typeof callback === 'function') callback(new Error('Not Found!'), null);
    }
};

Images.prototype.convertI2PtoPixelScreen = function (input) {
    var output = [];
    for (var i = 0; i < input.length; i++) {
        output.push([])
        for (var j = 0; j < input[i].length; j++) {
            output[i].push([
                input[i][j].red,
                input[i][j].green,
                input[i][j].blue
            ]);
        }
    }
    return output;
};

module.exports = Images;