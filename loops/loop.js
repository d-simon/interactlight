var pixelScreen = require('../screen-36x24.js');
var util = require('../interactlight/util.js');
var i2p = require('image2pixels');
var deepcopy = require('deepcopy');

var fileConfig = {
    '1': { prefix: './loop/loop', suffix: '.png', counterLength: 6, start: 1, end: 1128, fps: 24 },
    '2': { prefix: './loop2/loop2', suffix: '.png', counterLength: 6, start: 1, end: 719, fps: 24 },
    '3': { prefix: './loop3/loop3', suffix: '.png', counterLength: 6, start: 1, end: 902, fps: 24 },
    '4': { prefix: './loop4/loop4', suffix: '.png', counterLength: 6, start: 1, end: 601, fps: 24 },
    '5': { prefix: './loop5/loop5', suffix: '.png', counterLength: 6, start: 1, end: 1199, fps: 24 },
    '6': { prefix: './loop6/loop6', suffix: '.png', counterLength: 6, start: 1, end: 468, fps: 24 },
    '7': { prefix: './loop7/loop75', suffix: '.png', counterLength: 6, start: 1, end: 1200, fps: 24 },
    '8': { prefix: './loop8/loop8', suffix: '.png', counterLength: 6, start: 1, end: 300, fps: 24 },
    '9': { prefix: './loop9/loop9', suffix: '.png', counterLength: 6, start: 1, end: 601, fps: 24 },
    '10': { prefix: './loop10/loop10', suffix: '.png', counterLength: 6, start: 1, end: 898, fps: 24 }
};


// Load and Cache pixelimages

var current = (process.argv[2] && fileConfig[process.argv[2]]) ? fileConfig[process.argv[2]] : fileConfig['1'];

var loopCount = 0;

current.files = [];
current.images = [];

for (var i = 0; i < current.end - current.start; i++) {
    current.files[i] = current.prefix + util.padString(i+current.start,6) + current.suffix;
}

console.log('Loading...');
iterateAsync(0, current.files.length,
    function (i, callback) {
        var filename = current.files[i];
        i2p(filename, { pixelsCallback: util.convertI2PtoPixelScreen }, function (err, pixels) {
            current.images[i] = deepcopy(pixels);
            if (callback && typeof callback == 'function') callback();
        });
    },
    function cb () {
        console.log('Done!')
        setInterval(function () {
            pixelScreen.update(current.images[loopCount]);
            loopCount++;
            if (loopCount >= current.end - current.start) loopCount = 0;
        },1000/current.fps);
    }
);


function iterateAsync (i, length, func, callback) {
    if (i < length ) {
        func(i, function cb () {
            iterateAsync(i+1, length, func, callback);
        });
    } else {
        if (callback && typeof callback === 'function') callback();
    }
}

module.exports = pixelScreen;