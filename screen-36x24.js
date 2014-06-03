var config = require('./config.js')
  , Artnet = require('artnet-node')
  , PixelScreen = require('pixelscreen');

var omc1 = Artnet.Client.createClient(config.omc.addresses[0], 6454) // 12x12
  , omc2 = Artnet.Client.createClient(config.omc.addresses[1], 6454) // 12x12
  , omc3 = Artnet.Client.createClient(config.omc.addresses[2], 6454) // 12x12
  , omc4 = Artnet.Client.createClient(config.omc.addresses[3], 6454) // 12x12
  , omc5 = Artnet.Client.createClient(config.omc.addresses[4], 6454) // 12x12
  , omc6 = Artnet.Client.createClient(config.omc.addresses[5], 6454);// 12x12

var pixelScreen = new PixelScreen({ width: 36, height: 24, channels: 3, displayScreen: config.displayTerminalScreen });

pixelScreen
    .registerScreen('omc1', { x: 0, y: 0, width: 12, height: 12, channels: 3, dmx: true },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc1.send(pixelImage);
        })
    .registerScreen('omc2', { x: 12, y: 0, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc2.send(pixelImage);
        })
    .registerScreen('omc3', { x: 24, y: 0, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc3.send(pixelImage);
        })
    .registerScreen('omc4', { x: 0, y: 12, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc4.send(pixelImage);
        })
    .registerScreen('omc5', { x: 12, y: 12, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc5.send(pixelImage);
        })
    .registerScreen('omc6', { x: 24, y: 12, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc6.send(pixelImage);
        });

module.exports = pixelScreen;