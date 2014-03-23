var twitter = require('ntwitter')
  , twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

function TwittStream () {
    this.streams = {};
}

TwittStream.prototype.createStream = function (name, type, options, dataCllback) {
    if (!name || this.streams[name]) throw new Error('Stream "' + name + '" already exists!');
    var stream = twit.stream('statuses/sample', {filter_level:'none'}, function(stream) {
        stream.on('data', function(data) { dataCallback(data); });
        stream.on('error', function(err) { console.log(err); });
    });
    this.streams.push[name](stream);
};


module.exports = TwittStream;