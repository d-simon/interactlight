var gd = require('node-gd')
  , mopen = require('gd-magicopen')
  , i2p = require('gd-image2pixels')
  , extend = require('extend');

module.exports = function (filename, options, callback) {

    var opts;
    if (typeof options === 'function') {
        callback = options;
        opts = {};
    } else {
        opts = options || {};
    }
    // Default Settings
    opts = extend({ GD: false, pixelsCallback: false }, opts);

    mopen(filename, function (err, inputimg){
        if (err) return callback(err, null);
        var pixels = i2p(inputimg);

        // Pixels Callback
        if (typeof opts.pixelsCallback === 'function') pixels = opts.pixelsCallback(pixels) || pixels;

        // Process
        if (opts.GD === true) {
            // GD output
            var height = pixels.length
              , width = pixels[0].length
              , outputimg = gd.createTrueColor(width, height);

            for(var i = 0; i < height; i++)
            {
                for(var j = 0; j < width; j++)
                {
                    var pixel = pixels[i][j];
                    var color = gd.trueColor(pixel.red, pixel.green, pixel.blue);
                    outputimg.setPixel(j, i, pixel.raw);
                }
            }
            callback(null, outputimg);
        } else {
            // Raw data output
            callback(null, pixels);
        }
    });
};