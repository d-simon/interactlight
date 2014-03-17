var util = require('util');
var config = require('./config.js');
var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});


// twit.stream('statuses/filter', {track:'ukraine'}, function(stream) {
//     stream.on('data', function(data) {
//         console.log('ukraine', data.text.replace(/(\r\n|\n|\r)/gm,""));
//     });
// });

// twit.stream('statuses/filter', {track:'russia'}, function(stream) {
//     stream.on('data', function(data) {
//         console.log('russia ', data.text.replace(/(\r\n|\n|\r)/gm,""));
//     });
// });

twit.stream('statuses/sample', function(stream) {
    stream.on('data', function(data) {
        if(data.text) console.log(data.filter_level, data.text.replace(/(\r\n|\n|\r)/gm,""));
    });
});
