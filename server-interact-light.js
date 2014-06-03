var pixelScreen = require('./screen-36x24.js')
  , util = require('./interactlight/util.js')
  , i2p = require('image2pixels')
  , fs = require('fs')
  , deepcopy = require('deepcopy')
  , coordinates = require('./interactlight/coordinates.js')
  , config = require('./config.js')
  , midi = require('midi')
  , twitter = require('ntwitter')
  , twit = new twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token_key: config.twitter.access_token_key,
        access_token_secret: config.twitter.access_token_secret
    })
  , Images = require('./interactlight/images.js')
  , Sound = require('./interactlight/sound.js')(midi)
  , server = require('./interactlight/server.js')
  , WorldMap = require('./interactlight/worldmap.js')(pixelScreen, fs, config, twit)
  , LoopPlayer = require('./interactlight/loop-player.js')(pixelScreen, util, i2p, deepcopy, config.video.files);


var images = new Images(pixelScreen, {
    'black':     './media/36x24_black.png',
    'white':     './media/36x24_white.png',
    'tweet_bw':  './media/36x24_tweet_bw.png',
    'tweet_wb':  './media/36x24_tweet_wb.png',
    'arabia':    './media/cities_36x24_arabia.png',
    'zuerich':    './media/cities_36x24_zurich.png',
    'europe':    './media/cities_36x24_europe.png',
    'london':    './media/cities_36x24_london.png',
    'newyork':    './media/cities_36x24_newyork.png',
    'world':    './media/cities_36x24_world.png'
});


var sound, sound2;
if (config.midi.enable === true) {
    sound = new Sound({ 'midiPort': config.midi.ports[0] });
    sound2 = new Sound({ 'midiPort': config.midi.ports[1] });
}

var worldMap = new WorldMap();
var loopPlayer = new LoopPlayer();

// Start Image
images.showImage('tweet_bw');
streamCallback({text: 'loop'});
// Input Stream

twit.stream('statuses/filter', { follow: config.twitter.userId, filter_level:'none'}, function (stream) {
    stream.on('data', streamCallback);
    stream.on('error', function(error, code) {
        console.log("Twitter Stream: " + error + ": " + code);
    });
});

// Input Stream
process.stdin.resume(); // see http://nodejs.org/docs/v0.4.7/api/process.html#process.stdin
process.stdin.on('data', function (chunk) { // called on each line of input
    var line = chunk.toString().replace(/\n/,'');
    streamCallback({text: line});
});

function hasKeyword (str, keyword) {
    return str.indexOf(keyword) > -1;
}
function getCoordsStr (str) {
    var places = {
        'newyork':     ['ny', 'newyork'],
        'london':      ['london'],
        'arabia':      ['arabia', 'saudi'],
        'switzerland': ['swizerland', 'swiss'],
        'ukraine':     ['ukraine'],
        'school':      ['school'],
        'europe':      ['europe', 'eu']
    };
    for (var place in places) {
        for (var i = 0; i < places[place].length; i++) {
            console.log(places[place][i]);
            if (hasKeyword(str, places[place][i])) return place;
        }
    }
    return 'world';
}

function resetState () {
    console.log(worldMap.running, loopPlayer.running);
    worldMap.stop();
    loopPlayer.stop();
    images.showImageSafe('black');
}

function streamCallback (data) {


    if (data.user && data.user.name) server.io.sockets.emit('tweet', data.user.name + ' : ' + data.text);

    var cmd = (data.text) ? data.text.toLowerCase().split(' ').join('') : 'black';
    function has (keyword) {
        return hasKeyword(cmd, keyword);
    }
    // Tweet Sound On Input
    if (config.midi.enable === true) sound.sendMIDI(45);


    // Stop
    if (has('stop')) {
        console.log('cmd: stop');
        server.io.sockets.emit('cmd', 'stop');
        resetState();

    // Black
    } else if (has('black')) {
        console.log('cmd: black');
        server.io.sockets.emit('cmd', 'black');
        resetState();
        images.showImageSafe('tweet_bw');

    // White
    } else if (has('white')) {
        console.log('cmd: white');
        server.io.sockets.emit('cmd', 'white');
        resetState();
        images.showImageSafe('tweet_wb');

    // Black
    } else if (has('loop')) {
        var cmd = '0';
        console.log('cmd: loop');
        server.io.sockets.emit('cmd', 'loop');
        resetState();
        loopPlayer.play('0');

    // // Color
    // } else if (has('color') || has('colour')) {
    //     console.log('cmd: color');

    // // Image
    // } else if (has('image') || has('http://t.co/')) {
    //     console.log('cmd: image');

    // Map
    } else if (has('world') || has('map') || has('orchestra')) {
        var word = (has('world')) ? 'world' : 'map';
        console.log('cmd: ', word);
        server.io.sockets.emit('cmd', word);
        resetState();

        var coordsStr = getCoordsStr(cmd)
          , coords = coordinates[coordsStr]
          , image = (images.files[coordsStr]) ? coordsStr : 'tweet_bw';
        images.showImageSafe(image, function (err) {
            if (err) return console.log(err);
            setTimeout(function () {
                images.showImageSafe('black', function (err) {
                    if (err) return console.log(err);
                    worldMap.start(coords, false, function tweetCallback (data) {

                        var offset = (coordsStr === 'world') ? Math.random()*500 : 0;

                        if (config.midi.enable === true) {
                            // Send MIDI from time zone
                            var timezoneKey = ~~(data.user.utc_offset / 3600 + 12) // 0-23
                              , note = sound.midiTable[sound.key[timezoneKey % sound.key.length]][~~(timezoneKey / sound.key.length)];
                            setTimeout(function () {
                                if (has('orchestra')) {
                                    sound2.sendMIDI(40+note);
                                } else {
                                    sound.sendMIDI(40+note);
                                }
                            },offset);
                        }

                        server.io.sockets.emit('tweet-stream', data);
                    },
                    function errorCallback (err) {
                        if (err) return console.log(err);
                        streamCallback({text: 'white'});
                    });
                });
            }, 4000);
        });
    }
}
