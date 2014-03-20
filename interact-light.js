var config = require('./config.js');
var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

// twit.stream('statuses/filter', {track:'ukraine', filter_level:'none'}, function(stream) {
//     stream.on('data', function(data) {
//         if (data.text) console.log('ukraine', data.text.replace(/(\r\n|\n|\r)/gm,""));
//     });
// });

twit.stream('user', {track:'nodejs'}, function(stream) {
  stream.on('data', function (data) {
    console.log(data);
  });
  stream.on('end', function (response) {
    // Handle a disconnection
  });
  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
  // Disconnect stream after five seconds
  setTimeout(stream.destroy, 5000);
});
