var pixelScreen = require('./screen-36x24.js')
  , WorldMap = require('./interactlight/worldmap.js')
  , coordinates = require('./interactlight/coordinates.js')
  , config = require('./config.js')
  , twitter = require('ntwitter')
  , Images = require('./interactlight/images.js')
  , Sound = require('./interactlight/sound.js')
  , server = require('./interactlight/server.js');

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

var sound = new Sound({ 'midiPort': config.midi.ports[0] });
var sound2 = new Sound({ 'midiPort': config.midi.ports[1] });

var twit = new twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token_key: config.twitter.access_token_key,
        access_token_secret: config.twitter.access_token_secret
    });

var worldMap = new WorldMap()

// Start Image
images.showImage('tweet_bw');

// Input Stream
twit.stream('statuses/filter', { follow: config.twitter.userId, filter_level:'none'}, function(stream) {
    stream.on('data', streamCallback);
});

// Input Stream
process.stdin.resume(); // see http://nodejs.org/docs/v0.4.7/api/process.html#process.stdin
process.stdin.on('data', function (chunk) { // called on each line of input
    var line = chunk.toString().replace(/\n/,'');
    streamCallback({text: line});
});


function streamCallback (data) {

    if (data.user && data.user.name) server.io.sockets.emit('tweet', data.user.name + ' : ' + data.text);
    console.log(data);
    var cmd = data.text.toLowerCase()
                       // .replace('@interactlight','')
                       .split(' ')
                       .join('');

    // Tweet Sound
    sound.sendMIDI(45);

    function hasKeyword (str, keyword) {
        return str.indexOf(keyword) > -1;
    }
    function has (keyword) {
        return hasKeyword(cmd,keyword);
    }
    function getCoordsStr () {
        var returnStr;
        if (has('ny') || (has('new') && has('york')) || has('newyork')) { returnStr = 'newyork'; }
        else if (has('london')) { returnStr = 'london'; }
        else if (has('arabia') || has('saudi')) { returnStr = 'arabia'; }
        else if (has('europe') || has('eu')) { returnStr = 'europe'; }
        else if (has('switzerland') || has('swiss')) { returnStr = 'switzerland'; }
        else if (has('ukraine')) { returnStr = 'ukraine'; }
        else if (has('school')) { returnStr = 'school'; }
        else if (has('zuerich') || has('zueri') || has('z%FCri')) { returnStr = 'zuerich'; }
        else { returnStr = 'world'; }
        return returnStr;
    }

    function resetState () {
        worldMap.stop();
        images.showImageSafe('black');
    }


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

    // // Color
    // } else if (has('color') || has('colour')) {
    //     console.log('cmd: color');

    // // Image
    // } else if (has('image') || has('http://t.co/')) {
    //     console.log('cmd: image');

    // Orchestra
    } else if (has('orchestra')) {
        console.log('cmd: ', 'orchestra');
        server.io.sockets.emit('cmd', 'orchestra');

        resetState();
        var coordsStr = getCoordsStr()
          , coords = coordinates[coordsStr];
          console.log(coordsStr, !!images.files[coordsStr]);
        images.showImageSafe((images.files[coordsStr]) ? coordsStr : 'tweet_bw', function (err) {
            setTimeout(function () {
                images.showImageSafe('black', function (err) {
                    worldMap.start(coords, false, function tweetCallback (data) {

                        var offset = 0;
                        if (coordsStr == 'world') offset = Math.random()*500;

                        // Send MIDI from time zone
                        var timezoneKey = ~~(data.user.utc_offset / 3600 + 12) // 0-23
                          , note = sound2.midiTable[sound.key[timezoneKey % sound2.key.length]][~~(timezoneKey / sound2.key.length)];
                        setTimeout(function () {
                            sound2.sendMIDI(36+note)
                        }, offset);

                    });
                });
            }, 4000);
        });

    // Map
    } else if (has('world') || has('map')) {
        var word = 'map';
        if (has('world')) word = 'world';
        console.log('cmd: ', word);
        server.io.sockets.emit('cmd', word);

        resetState();
        var coordsStr = getCoordsStr()
          , coords = coordinates[coordsStr]
          , image = (images.files[coordsStr]) ? coordsStr : 'tweet_bw';
        images.showImageSafe(image, function (err) {
            setTimeout(function () {
                images.showImageSafe('black', function (err) {
                    worldMap.start(coords, false, function tweetCallback (data) {

                        var offset = 0;
                        if (coordsStr == 'world') offset = Math.random()*500;

                        // Send MIDI from time zone
                        var timezoneKey = ~~(data.user.utc_offset / 3600 + 12) // 0-23
                          , note = sound.midiTable[sound.key[timezoneKey % sound.key.length]][~~(timezoneKey / sound.key.length)];
                        setTimeout(function () {
                            sound.sendMIDI(40+note)
                        },offset);

                    });
                });
            }, 4000);
        });
    }
}
