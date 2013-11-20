$(function() {
    var socket = io.connect(window.location.hostname);
    return;
    socket.on('data', function(data) {
        var total = data.total;
        for (var key in data.symbols) {
            var val = data.symbols[key] / total;
            if (isNaN(val)) {
                val = 0;
            }
            
            $('li[data-symbol="' + key + '"]').each(function() {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) +',0,0)');
            });
        }
        $('#last-update').text(new Date().toTimeString());
    });
})


angular.module('rainMapper', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
