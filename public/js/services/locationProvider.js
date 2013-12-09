'use strict';

/**
 * Geo service that provides current location
 */
app.service('geo',['$rootScope', function($rootScope) {

    var position = null;

    this.askForPermission = function(){
        if (navigator.geolocation) {
            var timeoutVal = 10 * 1000 * 1000;
            navigator.geolocation.getCurrentPosition(
                this.setPosition,
                this.setPosition,
                { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
            );
        }
    };

    this.setPosition = function(position){
        this.position = position.coords;
        $rootScope.$broadcast('geolocationChange', this.position);
    };

    // Initialize the service
    return this.askForPermission();

}]);