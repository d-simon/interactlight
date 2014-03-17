var twitter = require('ntwitter');
var cluster = require('cluster');
var twit = new twitter({
    consumer_key: 'hJX4AUlpQQPLzxSlJrupBQ',
    consumer_secret: 'H2KEcT40VKSDcj7kfbGIxEdOBsgbG798bwSAl8ClEmQ',
    access_token_key: '327060292-mGH02XJ4vu6kslc7FYxBtz6sxyXnKr9ypMj9RGqM',
    access_token_secret: '5jn9fdIlYGwVXIeNtnZDuB0OkW6id73gPR516DYfyP7R4'
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
        stream.on('data', function(data) {
           console.log(worker_id, data.filter_level, track, data.text);
        });
    });

}