var config = require('./config.js')
  , Artnet = require('artnet-node')
  , PixelScreen = require('pixelscreen');

var omc1 = Artnet.Client.createClient(config.omc.addresses[0], 6454) // 12x12
  , omc2 = Artnet.Client.createClient(config.omc.addresses[1], 6454);// 12x12

var pixelScreen = new PixelScreen({ width: 24, height: 12, channels: 3 });

pixelScreen
    .registerScreen('omc1', { x: 0, y: 0, width: 12, height: 12, channels: 3, dmx: true },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc2.send(pixelImage);
        });

pixelScreen
    .registerScreen('omc2', { x: 12, y: 0, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc1.send(pixelImage);
            console.log(pixelImage);
        });


var i2p = require('image2pixels');

var files = [],
    count = 0
for (var i = 0; i < 46; i++) {
    files.push('../video/hoi_text/hoi_text'+padString(i,4)+'.jpg');
    //console.log(files);
}

setInterval(function () {
    var filename = files[count];
    i2p(filename, { pixelsCallback: convertI2PtoPixelScreen }, function (err, pixels) {
        pixelScreen.update(pixels);
    });
    count++;
    if (count > 45) count = 0;
},33);

function padString (str, width, paddingStr) {
    paddingStr = paddingStr || '0';
    str = str + '';
    while (str.length < width) { str = paddingStr + str; }
    return str;
}

function convertI2PtoPixelScreen (input) {
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

module.exports = pixelScreen;