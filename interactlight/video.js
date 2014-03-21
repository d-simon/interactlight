var config = require('../config.js')
  , Artnet = require('artnet-node')
  , pixelScreen = require('../screen-36x24.js')
  , i2p = require('image2pixels');

var files = [],
    count = 0;
for (var i = 1; i < 1128; i++) {
    files.push('./loop/loop'+padString(i,6)+'.png');
}

var interval = setInterval(function () {
    var filename = files[count];
    console.log(filename);
    i2p(filename, { pixelsCallback: convertI2PtoPixelScreen }, function (err, pixels) {
        console.log(pixels);
        pixelScreen.update(pixels);
    });
    count++;
    if (count > 1126) count = 0;
},33);

function padString (str, width, paddingStr) {
    paddingStr = paddingStr || '0';
    str = str + '';
    while (str.length < width) { str = paddingStr + str; }
    return str;
}

function convertI2PtoPixelScreen (input) {
    console.log(input);
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
    console.log(output);
    return output;
}

module.exports = interval;