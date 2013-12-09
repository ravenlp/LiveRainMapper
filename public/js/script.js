'use strict';
/**
 * RainMapper module as the main app
 */
var app = angular.module('rainMapper', ['ngRoute', 'leaflet-directive']);
app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
