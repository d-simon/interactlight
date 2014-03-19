var config = require('./config.js')
  , Artnet = require('artnet-node')
  , PixelScreen = require('pixelscreen')
  , midi = require('midi');

var i2p = require('image2pixels');

var omc1 = Artnet.Client.createClient(config.omc.addresses[0], 6454) // 12x12
  , omc2 = Artnet.Client.createClient(config.omc.addresses[1], 6454) // 12x12
  , omc3 = Artnet.Client.createClient(config.omc.addresses[2], 6454) // 12x12
  , omc4 = Artnet.Client.createClient(config.omc.addresses[3], 6454) // 12x12
  , omc5 = Artnet.Client.createClient(config.omc.addresses[4], 6454) // 12x12
  , omc6 = Artnet.Client.createClient(config.omc.addresses[5], 6454);// 12x12

var pixelScreen = new PixelScreen({ width: 36, height: 12, channels: 3 })
  , pixelScreen2 = new PixelScreen({ width: 36, height: 12, channels: 3 });

pixelScreen.registerScreen('omc1', { x: 0, y: 0, width: 12, height: 12, channels: 3, dmx: true },
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
        });
pixelScreen2.registerScreen('omc4', { x: 0, y: 0, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc4.send(pixelImage);
        })
    .registerScreen('omc5', { x: 12, y: 0, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc5.send(pixelImage);
        })
    .registerScreen('omc6', { x: 24, y: 0, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc6.send(pixelImage);
        });


// Set up a new input.
var input = new midi.input();

console.log (input.getPortName(2));

input.openPort(2);

// LPD8 MIDI SETUP
// 40 41 42 43
// 36 37 38 39

var currentNote = [-1,-1];
input.on('message', function (deltaTime, message) {
    //console.log('m:' + message + ' d:' + deltaTime);
    //console.log(message, message[1]);
    var screen = ~~(message[1] / 12);
    if (message[1] === currentNote[screen] && message[0] === 144 && message[2] !== 0) {
        showImage('black', screen);
        currentNote[screen] = -1;
    } else if (message[0] === 144 && message[1] !== currentNote[screen] && message[2] !== 0) {
        currentNote[screen] = message[1];
        var relNote = currentNote[screen] % 12;
           //console.log(relNote);
        switch(relNote) {
            case 0:
                showImage('white', screen);
                break;
            case 1:
                showImage('black', screen);
                break;
            case 2:
                showImage('schenk', screen);
                break;
            case 3:
                showImage('pex', screen);
                break;
            case 4:
                showImage('martin', screen);
                break;
            case 5:
                showImage('oberli', screen);
                break;
            case 7:
                showImage('basil', screen);
                break;
            case 9:
                showImage('locher', screen);
                break;
            case 11:
                showImage('cili', screen);
                break;
            default:
                break;
        }
    }
});



var files = [
        './media/abspann_black_36_12.png',
        './media/abspann_white_36_12.png',
        './media/abspann_pex_36_12.png',
        './media/abspann_martin_36_12.png',
        './media/abspann_schenk_36_12.png',
        './media/abspann_basil_36_12.png',
        './media/abspann_oberli_36_12.png',
        './media/abspann_cili_36_12.png',
        './media/abspann_locher_36_12.png',
    ]

function showImage (str, screen) {
    console.log(screen, str);
    switch(str) {
        case 'black':
            sendImage(files[0], screen);
            break;
        case 'white':
            sendImage(files[1], screen);
            break;
        case 'pex':
            sendImage(files[2], screen);
            break;
        case 'martin':
            sendImage(files[3], screen);
            break;
        case 'schenk':
            sendImage(files[4], screen);
            break;
        case 'basil':
            sendImage(files[5], screen);
            break;
        case 'oberli':
            sendImage(files[6], screen);
            break;
        case 'cili':
            sendImage(files[7], screen);
            break;
        case 'locher':
            sendImage(files[8], screen);
            break;
        default:
            break;
    }
}
function sendImage (filePath, screen) {
    console.log(filePath);
    i2p(filePath, { pixelsCallback: convertI2PtoPixelScreen }, function (err, pixels) {
        switch(screen) {
            case 0:
                console.log('screen1');
                console.log('pixels:', pixels);
                pixelScreen.update(pixels);
                break;
            case 1:
                console.log('screen2');
                //console.log('pixels:', pixels)
                pixelScreen2.update(pixels);
                break;
            default:
                break;
        }
    });
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
    //console.log(output);
    return output;
}

module.exports = pixelScreen;