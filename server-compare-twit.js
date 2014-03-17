var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: 'hJX4AUlpQQPLzxSlJrupBQ',
    consumer_secret: 'H2KEcT40VKSDcj7kfbGIxEdOBsgbG798bwSAl8ClEmQ',
    access_token_key: '327060292-mGH02XJ4vu6kslc7FYxBtz6sxyXnKr9ypMj9RGqM',
    access_token_secret: '5jn9fdIlYGwVXIeNtnZDuB0OkW6id73gPR516DYfyP7R4'
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
