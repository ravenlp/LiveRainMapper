'use strict';

angular.module('rainMapper')
    .controller('MainCtrl', ['$scope', 'socket','$timeout', function ($scope, socket, $timeout) {



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


        var mapquestUrl = "http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png",
            mapquestSubDomains = ["otile1","otile2","otile3","otile4"],
            mapquestAttrib = 'Data, imagery and map information provided by '
                + '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, '
                + '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and '
                + '<a href="http://wiki.openstreetmap.org/wiki/Contributors" target="_blank">contributors</a>. '
                + 'Data: <a href="http://wiki.openstreetmap.org/wiki/Open_Database_License" target="_blank">ODbL</a>, '
                + 'Map: <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>',
            mapquest = new L.TileLayer(mapquestUrl, {maxZoom: 18, attribution: mapquestAttrib, subdomains: mapquestSubDomains});

        var rain = L.OWM.rain({opacity: 0.5});

        var overlayMaps = {
            "Rain": rain
        };

        var baseMaps = {
            "Mapquest Open": mapquest
        };

        var layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed: false});

        //map.addLayer(validatorsLayer);
        $timeout(function(){

             console.log("HECHO");
            $scope.$broadcast('leafletDirectiveSetMap', ['addControl',layerControl]);
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