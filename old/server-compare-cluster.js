var config = require('./config.js');

var cluster = require('cluster');

var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

if (cluster.isMaster) {

    for (var i = 2; i < process.argv.length; i++) {
        cluster.fork({ 'WORKER_ID': i-1, 'KEYWORD': process.argv[i] });
    }

    cluster.on('exit', function (worker, code, signal) {
        if (code != 0) {
            console.log('Worker %d died! (%d) Spawning a replacement.',  worker.process.pid, (signal || code));
            cluster.fork();
        }
    });

    cluster.on('disconnect', function (worker) {
        console.log('The worker %d has disconnected', worker.process.pid);
    });


} else {
    var track = process.env['KEYWORD']
      , worker_id = process.env['WORKER_ID'];
    twit.stream('statuses/filter', {track:track, filter_level: 'low'}, function(stream) {
        stream.on('data', function (data) {
           console.log(worker_id, data.filter_level, track, data.text);
        });
    });

}