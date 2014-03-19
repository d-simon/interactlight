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

var pixelScreen = new PixelScreen({ width: 24, height: 36, channels: 3 });

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
    .registerScreen('omc3', { x: 0, y: 12, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc3.send(pixelImage);
        })
    .registerScreen('omc4', { x: 12, y: 12, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc4.send(pixelImage);
        })
    .registerScreen('omc5', { x: 0, y: 24, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc5.send(pixelImage);
        })
    .registerScreen('omc6', { x: 12, y: 24, width: 12, height: 12, channels: 3, dmx: true  },
        function callback (err, pixelImage) {
            if (err) console.log(err);
            omc6.send(pixelImage);
        });


// Set up a new input.
var input = new midi.input();

console.log (input.getPortName(1));

input.openPort(1);

// LPD8 MIDI SETUP
// 40 41 42 43
// 36 37 38 39

var currentNote = -1
  , currentIntensity = 127;
input.on('message', function (deltaTime, message) {
    console.log('m:' + message + ' d:' + deltaTime);
    // console.log(message, message[1]);
    if (message[0] === 176) {
        console.log('current', currentIntensity, message[2]);
        currentIntensity = message[2];
        var relNote = currentNote % 12;
        showImageFromNote(relNote);
    } else if (message[1] === currentNote && message[0] === 144 && message[2] !== 0) {
        showImage('black');
        currentNote = -1;
    } else if (message[0] === 144 && message[1] !== currentNote && message[2] !== 0) {
        currentNote = message[1];
        var relNote = currentNote % 12;
        showImageFromNote(relNote);
    }
});



var files = [
        './media/abspann__white_24_36.png',
        './media/abspann__black_24_36.png',
        './media/abspann__after_the_dark_24_36.png',
        './media/abspann__pex_1_24_36.png',
        './media/abspann__pex_2_24_36.png',
        './media/abspann__pex_3_24_36.png',
        './media/abspann__pex_4_24_36.png'
    ]

function showImageFromNote (note) {
        switch(note) {
            case 0:
                showImage('white');
                break;
            case 1:
                showImage('black');
                break;
            case 2:
                showImage('afterTheDark');
                break;
            case 4:
                showImage('pex1');
                break;
            case 5:
                showImage('pex2');
                break;
            case 7:
                showImage('pex3');
                break;
            case 9:
                showImage('pex4');
                break;
            default:
                break;
        }
}
function showImage (str) {
    switch(str) {
        case 'white':
            sendImage(files[0]);
            break;
        case 'black':
            sendImage(files[1]);
            break;
        case 'afterTheDark':
            sendImage(files[2]);
            break;
        case 'pex1':
            sendImage(files[3]);
            break;
        case 'pex2':
            sendImage(files[4]);
            break;
        case 'pex3':
            sendImage(files[5]);
            break;
        case 'pex4':
            sendImage(files[6]);
            break;
        default:
            break;
    }
}
function sendImage (filePath) {
    i2p(filePath, { pixelsCallback: convertI2PtoPixelScreen }, function (err, pixels) {
        pixelScreen.update(pixels);
    });
}

function convertI2PtoPixelScreen (input) {
    var output = [];
    var intensityFactor = (1+currentIntensity)/128;
    console.log('intensityFactor', intensityFactor, currentIntensity);
    for (var i = 0; i < input.length; i++) {
        output.push([])
        for (var j = 0; j < input[i].length; j++) {
            output[i].push([
                input[i][j].red * intensityFactor,
                input[i][j].green * intensityFactor,
                input[i][j].blue * intensityFactor
            ]);
        }
    }
    //console.log(output);
    return output;
}

module.exports = pixelScreen;