var config = require('./config.js')
  , Artnet = require('artnet-node')
  , PixelScreen = require('../pixelscreen/index.js');

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
        });



var i2p = require('image2pixels');

var filename = '../video/hoi_text/hoi_text0045.jpg';

i2p(filename, { pixelsCallback: convertI2PtoPixelScreen }, function (err, pixels) {
    pixelScreen.update(pixels);
    setTimeout(function () {
        pixelScreen.update(pixels);
        console.log(omc2);
    }, 3000);;
});

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