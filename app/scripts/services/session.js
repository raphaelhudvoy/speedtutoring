'use strict';

angular.module('speedtutoringApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
