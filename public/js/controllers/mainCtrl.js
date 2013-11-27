'use strict';

angular.module('rainMapper')
    .controller('MainCtrl', ['$scope', 'socket','$timeout', function ($scope, socket, $timeout) {

        $scope.layers =  {
            baselayers: {
                googleTerrain: {
                    name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                },
                googleHybrid: {
                    name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                },
                googleRoadmap: {
                    name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                }
            }
        };


        $scope.tweets = [];

        $scope.map = {
            center: {
                lat: -27.74,
                lng: -57.17,
                zoom: 5
            },
            markers: {
                's': {lat: -27.74, lng: -57.17, focus: true, draggable: false, message:'HOLA CHE'}
            }
        };

        var validatorsLayer = new OsmJs.Weather.LeafletLayer({lang: 'en'});

        //map.addLayer(validatorsLayer);
        $timeout(function(){

            $scope.$broadcast('leafletDirectiveSetMap', ['addLayer', validatorsLayer]);
        }, 1000);

        // Incoming data
        var i = 0;
        socket.on('data', function(data) {
            if(data && angular.isArray(data)){
                angular.forEach(data, function(t,i){
                    if(t.coordinates){
                        $scope.tweets.push(t);
                        $scope.map.markers[t.id_str] = {
                            lat: t.coordinates.coordinates[1],
                            lng: t.coordinates.coordinates[0],
                            focus: true,
                            draggable: false,
                            message: t.text
                        };
                        console.log($scope.map.markers[t.id_srt]);
                    }
                });
            }



            console.log(i++, "DATA", data);
        });




    }]);