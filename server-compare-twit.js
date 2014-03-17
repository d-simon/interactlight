var config = require('./config.js');
var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

var count = 0;
for (var i = 2; i < process.argv.length; i++) (function (track) {
    // this will create a new variable i for each loop iteration
    // so we can use it in a callback :)
    twit.stream('statuses/filter', {track:track, filter_level: 'low'}, function(stream) {
        stream.on('data', function(data) {
           console.log(data.filter_level, track, data.text);
           count++;
        });
    });

}) (process.argv[i]);

setTimeout(function () {
    console.log('COUNT: '+count);
}, 30000);
