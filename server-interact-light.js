var pixelScreen = require('./screen-36x24.js');
var WorldMap = require('./interactlight/worldmap.js')
  , worldMap = new WorldMap();
var coordinates = require('./interactlight/coordinates.js');
var config = require('./config.js');
var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

// twit.stream('user', { replies: 'all' }, function (stream) {
//     stream.on('data', function (data) {
//         console.log(data);
//     });
//     stream.on('end', function (response) {
//         // Handle a disconnection
//     });
//     stream.on('destroy', function (response) {
//         // Handle a 'silent' disconnection from Twitter, no end/error event fired
//     });
// });

twit.stream('statuses/filter', { follow: config.twitter.userId, filter_level:'none'}, function(stream) {
    stream.on('data', function(data) {
        var cmd = data.text.toLowerCase()
                           .replace('@interactlight','')
                           .split(' ')
                           .join('');
        console.log(cmd);

        // Send a MIDI message.
        output.sendMessage([144,45,100]);
        setTimeout(function () {
            // Send Note End
            output.sendMessage([128,45,100]);
        },250);

        function hasKeyword (str, keyword) {
            return str.indexOf(keyword) > -1;
        }
        function has (keyword) {
            return hasKeyword(cmd,keyword);
        }
        function getCoords () {
            var returnCoords;
            if (has('ny') || (has('new') && has('york')) || has('newyork')) { returnCoords = coordinates['newyork']; }
            else if (has('london')) { returnCoords = coordinates['london']; }
            else if (has('arabia') || has('saudi')) { returnCoords = coordinates['arabia']; }
            else if (has('europe') || has('eu')) { returnCoords = coordinates['europe']; }
            else if (has('switzerland') || has('swiss')) { returnCoords = coordinates['switzerland']; }
            else if (has('ukraine')) { returnCoords = coordinates['ukraine']; }
            else if (has('school')) { returnCoords = coordinates['school']; }
            else if (has('zuerich') || has('zueri') || has('z%FCri')) { returnCoords = coordinates['zuerich']; }
            else { returnCoords = coordinates['world']; }
            return returnCoords;
        }

        // Black
        if (has('black')) {
            worldMap.stop();
            showImage('tweet_bw');

        // White
        } else if (has('white')) {
            worldMap.stop();
            showImage('tweet_wb');

        // Map
        } else if (has('world') || has('map')) {
            worldMap.stop();
            console.log('map!');
            var coords = getCoords();
            showImage('black', function (err) {
                // Safe Delay for Artnet
                setTimeout(function () {
                    worldMap.start(coords, false, function tweetCallback (data) {

                        var timezoneKey = ~~(data.user.utc_offset / 3600 + 12) // 0-23
                          , note = midiTable[key[timezoneKey % key.length]][~~(timezoneKey / key.length)];

                        //console.log(36+note);
                        // Send a MIDI message.
                        setTimeout(function () {
                            output.sendMessage([144,40+note,100]);
                            setTimeout(function () {
                                // Send Note End
                                output.sendMessage([128,40+note,100]);
                            },250);
                        },Math.random()*1000);

                    });
                }, 10);
            });
        }
    });
});

var midi = require('midi');
var output = new midi.output();
console.log(output.getPortCount(), output.getPortName(0));
output.openPort(0);
function generateMidiTable () {
    var returnA = [];
    for (var i = 0; i < 12; i++) {
        var array = [];
        for (var j = 0; j < 11; j++) {
            array.push(i + j*12);
        };
        returnA.push(array);
    }
    return returnA;
}
var midiTable = generateMidiTable()
  , key = [0,2,4,5,7,9,11]; // C dur


var i2p = require('image2pixels');

var files = [
        './media/36x24_black.png',
        './media/36x24_white.png',
        './media/36x24_tweet_bw.png',
        './media/36x24_tweet_wb.png'
    ]
  , currentFile = 0;


function showImage (str, callback) {
    var file;
    switch(str) {
        case 'black':
            file = files[0];
            break;
        case 'white':
            file = files[1];
            break;
        case 'tweet_bw':
            file = files[2];
            break;
        case 'tweet_wb':
            file = files[3];
            break;
        default:
            break;
    }
    if (file && file.length) {
        i2p(file, { pixelsCallback: convertI2PtoPixelScreen }, function (err, pixels) {
            pixelScreen.update(pixels);
            if (typeof callback === 'function') callback(null);
        });
    } else {
        if (typeof callback === 'function') callback(new Error('Not Found!'));
    }
}

showImage('tweet_bw');

function convertI2PtoPixelScreen(input) {
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
}
