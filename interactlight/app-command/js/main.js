angular.module('tweetDisplay', [
    'btford.socket-io'
])  .factory('socket', function (socketFactory) {
        return socketFactory();
    })
    .controller('MainCtrl', function ($scope) {

        $scope.tweets = [];
        $scope.commands = ['black'];

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



        $scope.$on('socket:tweet', function(ev, data) {

            // Emoji Filter
            // var ranges = [
            //   '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
            //   '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
            //   '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
            // ];
            // data = data.replace(new RegExp(ranges.join('|'), 'g'), '');

            console.log(data);
            $scope.tweets.unshift(data);

            if ($scope.tweets.length > 120) { $scope.tweets.shift($scope.tweets.length-20); }
        });
        $scope.$on('socket:cmd', function(ev, data) {

            // Emoji Filter
            // var ranges = [
            //   '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
            //   '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
            //   '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
            // ];
            // data = data.replace(new RegExp(ranges.join('|'), 'g'), '');

            console.log(data);
            $scope.commands.unshift(data);

            if ($scope.commands.length > 120) { $scope.commands.shift($scope.commands.length-20); }
        });
    })
    .run(function (socket) {
        socket.forward([
            'tweet',
            'cmd'
        ]);
    });