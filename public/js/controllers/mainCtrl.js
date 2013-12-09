'use strict';

app.controller('MainCtrl', ['$rootScope', '$scope', 'socket', '$timeout', 'geo',
                    function ($rootScope,   $scope,   socket,   $timeout,   geo) {

        $scope.map = {
            center: {
                lat: -27.74,
                lng: -57.17,
                zoom: 5
            },
            markers: {}
        };

        // Listen to the event to change current location after user give us permission
        $rootScope.$on('geolocationChange', function(e, data){
            $scope.map.markers['me'] = {lat: data.latitude, lng: data.longitude, focus: true, draggable: false, message: ''}
        });

        $scope.tweets = [];

        var rain_icon = L.icon({
            iconUrl: '/images/rain_marker.png',
            iconSize: [20, 32],
            iconAnchor: [10, 32],
            popupAnchor: [0, -32],
            shadowSize: [0, 0],
            shadowAnchor: [0, 0]
        });


        var mapquestUrl = "http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png",
            mapquestSubDomains = ["otile1","otile2","otile3","otile4"],
            mapquestAttrib = 'Data, imagery and map information provided by '
                + '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, '
                + '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and '
                + '<a href="http://wiki.openstreetmap.org/wiki/Contributors" target="_blank">contributors</a>. '
                + 'Data: <a href="http://wiki.openstreetmap.org/wiki/Open_Database_License" target="_blank">ODbL</a>, '
                + 'Map: <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>',
            mapquest = new L.TileLayer(mapquestUrl, {maxZoom: 18, attribution: mapquestAttrib, subdomains: mapquestSubDomains});



        var overlayMaps = {
            "Lluvia": L.OWM.rain({opacity: 0.4}),
            "Viento": L.OWM.wind({opacity: 0.4})
        };

        var baseMaps = {
            "Mapquest Open": mapquest
        };

        var layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed: false});

        var fullScreen = new L.Control.FullScreen();

        //map.addLayer(validatorsLayer);
        $timeout(function(){
            $scope.$broadcast('leafletDirectiveSetMap', ['addControl',layerControl]);
            $scope.$broadcast('leafletDirectiveSetMap', ['addControl',fullScreen]);
        }, 1000);

        // Incoming data
        socket.on('data', function(data) {
            if(data && angular.isArray(data)){
                angular.forEach(data, function(t,i){
                    if(t.coordinates){
                        $scope.tweets.push(t);
                        $scope.map.markers[t.id_str] = {
                            lat: t.coordinates.coordinates[1],
                            lng: t.coordinates.coordinates[0],
                            focus: false,
                            draggable: false,
                            message: t.text,
                            icon: rain_icon
                        };
                        if(!angular.isDefined($scope.map.markers[t.id_srt])){
                            console.log("ERROR", t);
                        }
                        console.log($scope.map.markers[t.id_srt]);
                    }
                });
            }
        });




    }]);