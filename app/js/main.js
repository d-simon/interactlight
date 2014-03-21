angular.module('tweetDisplay', [
    'btford.socket-io'
])  .factory('socket', function (socketFactory) {
        return socketFactory();
    })
    .controller('MainCtrl', function ($scope) {
        var clickSound = new buzz.sound( "/sound/click", {
            formats: [ "ogg", "mp3", "wav" ]
        });

        $scope.tweets = [];
        $scope.tweetsAll = [];

        // $scope.getFeaturedWord = function (string) {
        //     string = $scope.filterKeyWords(string);
        //     var words = string.split(' ');
        //     for (var i = words.length - 1; i >= 0; i--) {
        //         if (words[i].length < 4) {
        //             words.splice(i,1);
        //         }
        //     };

        //     var index = Math.ceil(Math.floor(Math.random() * (words.length))); // integer between 0 and words.length - 1
        //     return words[index];
        // };

        // $scope.filterKeyWords = function (s) {
        //     var words = ['RT', ':', '\\n', 'a', 'for', 'with', 'without', 'in', 'on', 'of', 'from', 'the', 'by', '&amp;']
        //       , prefixes = ['@', 'http', '&']
        //       , regexWords = new RegExp('(\\b|\\B)(' + words.join('|') + ')(\\b|\\B)', 'g')
        //       , regexPrefixes = new RegExp('(?:^|\\s)(' + prefixes.join('|') + ')(\\S+)(\\b|\\B)');
        //     return (s || '').replace(regexWords, '').replace(regexPrefixes, '').replace(/[ ]{2,}/, ' ');
        // };

        $scope.count = 10;
        $scope.$on('socket:tweet', function(ev, data) {
            //$scope.featured = $scope.getFeaturedWord(data.data.text);$
            //document.getElementById('click').play();
            // var ranges = [
            //   '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
            //   '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
            //   '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
            // ];
            // data.data.text = data.data.text.replace(new RegExp(ranges.join('|'), 'g'), '');

            if (data.data.lang == 'en' || data.data.lang == 'ru') {
                $scope.count++;
                if ($scope.count > 10) {
                    $scope.count = 0;
                    $scope.featured = data.data.text.replace('&amp;','&').replace('&lt;', '<').replace('&gt;', '>');
                    //console.log(data);
                    // if (data.data.entities.urls.length > 0) {
                    //     document.getElementById('backwindow').src = data.data.entities.urls[0].expanded_url;
                    // }
                }
            }

            clickSound.play();

            //$scope.tweets.unshift(data.data);
            //if ($scope.tweets.length > 100) { $scope.tweets.pop($scope.tweets.length); }

            if (data.tag === 'all') {
                $scope.tweetsAll.push(data.data);
            } else {
                $scope.tweets.push(data.data);
            }
            if ($scope.tweets.length > 120) { $scope.tweets.shift($scope.tweets.length-20); }

            if ($scope.tweetsAll.length > 120) { $scope.tweetsAll.shift($scope.tweetsAll.length-20); }
        });
    })
    .run(function (socket) {
        socket.forward([
            'tweet'
        ]);
    });