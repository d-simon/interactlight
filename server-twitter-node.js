var util = require('util'),
    twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: 'hJX4AUlpQQPLzxSlJrupBQ',
    consumer_secret: 'H2KEcT40VKSDcj7kfbGIxEdOBsgbG798bwSAl8ClEmQ',
    access_token_key: '327060292-mGH02XJ4vu6kslc7FYxBtz6sxyXnKr9ypMj9RGqM',
    access_token_secret: '5jn9fdIlYGwVXIeNtnZDuB0OkW6id73gPR516DYfyP7R4'
});


twit.stream('statuses/filter', {track:'ukraine', filter_level:'none'}, function(stream) {
    stream.on('data', function(data) {
        console.log('ukraine', data.filter_level, data.text.replace(/(\r\n|\n|\r)/gm,""));
    });
});

