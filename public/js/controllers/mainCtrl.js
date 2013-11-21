'use strict';

angular.module('rainMapper')
    .controller('MainCtrl', ['$scope', 'socket', function ($scope, socket) {

        $scope.tweets = [];

        $scope.map = {
            center: {
                lat: -27.74,
                lng: -57.17,
                zoom: 5
            },
            markers: {
                'asdasdasdasd': {lat: -99.55127064, lon: 27.44663564, focus: true, draggable: false, message:'HOLA CHE'}
            }
        };

        // Incoming data
        var i = 0;
        socket.on('data', function(data) {

            if(data && angular.isArray(data)){
                angular.forEach(data, function(t,i){
                    if(t.coordinates){
                        $scope.tweets.push(t);
                        $scope.map.markers[t.id_srt] = {
                            lat: t.coordinates.coordinates[0],
                            lon: t.coordinates.coordinates[1],
                            focus: true,
                            draggable: false
                        };
                        console.log($scope.map.markers[t.id_srt]);
                    }
                });
            }

            console.log(i++, "DATA", data);
        });




    }]);