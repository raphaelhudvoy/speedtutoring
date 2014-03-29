angular.module('speedtutoringApp').factory('WebSocketFactory', function ($rootScope, UserService) {
    
    var socket = io.connect('/');

    var Service = {};

    Service.receive = function (event, cb) {
        console.log('RECEIVES -> ', event);
        socket.on(event, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                cb.apply(socket, args);
            });
        });
    };

    Service.emit = function (eventName, data, cb) {
        console.log('EMIT -> ', eventName);
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if (cb) {
                    cb.apply(socket, args);
                }
            });
        });
    };

    Service.setAvailabilityOn = function () {
        socket.emit('availability-on');
    }

    Service.setAvailabilityOff = function () {
        socket.emit('availability-off');
    }

    UserService.getCurrentUserId().then(function (userId){
        socket.emit('join', userId);
    }, function (err){
        console.log(err);
    });

    return Service;
});