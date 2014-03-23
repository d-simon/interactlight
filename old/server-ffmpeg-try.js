var ffmpeg = require('fluent-ffmpeg')
  , fs = require('fs');

// create the target stream (can be any WritableStream)

var Duplex = stream.Duplex ||
    require('readable-stream').Duplex;
var stream = Duplex();
stream

//ws.pipe(stream);

// make sure you set the correct path to your video file
var proc = new ffmpeg({ source: '../material/The Substance - Albert Hofmann\'s LSD (Doku 2012 German).avi' })
    // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
    .fromFormat('avi')
    .toFormat('mjpeg')
    .withVideoCodec('mjpeg')
    .withSize('36x24')
    .withNoAudio()
    .withStrictExperimental()
    // setup event handlers
    .on('start', function(commandLine) {
        // The 'start' event is emitted just after the FFmpeg
        // process is spawned.

        console.log('Spawned FFmpeg with command: ' + commandLine);
    })

    .on('codecData', function(data) {
        // The 'codecData' event is emitted when FFmpeg first
        // reports input codec information. 'data' contains
        // the following information:
        // - 'format': input format
        // - 'duration': input duration
        // - 'audio': audio codec
        // - 'audio_details': audio encoding details
        // - 'video': video codec
        // - 'video_details': video encoding details
        console.log('Input is ' + data.audio + ' audio with ' + data.video + ' video');
    })

    .on('progress', function(progress) {
        // The 'progress' event is emitted every time FFmpeg
        // reports progress information. 'progress' contains
        // the following information:
        // - 'frames': the total processed frame count
        // - 'currentFps': the framerate at which FFmpeg is
        //   currently processing
        // - 'currentKbps': the throughput at which FFmpeg is
        //   currently processing
        // - 'targetSize': the current size of the target file
        //   in kilobytes
        // - 'timemark': the timestamp of the current frame
        //   in seconds
        // - 'percent': an estimation of the progress

        console.log('Processing: ' + progress.percent + '% done');
    })
    .on('end', function() {
    console.log('file has been converted succesfully');
    })
    .on('error', function(err) {
    console.log('an error happened: ' + err.message);
    })
    // save to stream
    .writeToStream(stream, {end:true});