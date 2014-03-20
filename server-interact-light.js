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
        function has (keyword) {
            return cmd.indexOf(keyword) > -1;
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
            var coords;
            if (has('ny') || (has('new') && has('york')) || has('newyork')) { coords = coordinates['newyork']; }
            else if (has('london')) { coords = coordinates['london']; }
            else if (has('arabia') || has('saudi')) { coords = coordinates['arabia']; }
            else if (has('europe') || has('eu')) { coords = coordinates['europe']; }
            else if (has('switzerland') || has('swiss')) { coords = coordinates['switzerland']; }
            else if (has('ukraine')) { coords = coordinates['ukraine']; }
            else if (has('school')) { coords = coordinates['school']; }
            else if (has('zuerich') || has('zueri') || has('z%FCri')) { coords = coordinates['zuerich']; }
            else { coords = coordinates['world']; }

            showImage('black', function (err) {
                // Safe Delay for Artnet
                setTimeout(function () {
                    worldMap.start(coords);
                }, 10);
            });
        }
    });
});


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
