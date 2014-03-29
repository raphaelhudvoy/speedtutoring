'use strict';

angular.module('speedtutoringApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.regUser = {};
    $scope.regErrors = {};

    $scope.register = function(form) {
      $scope.submitted = true;
  
      if(form.$valid) {
        Auth.createUser({
          name: $scope.regUser.name,
          email: $scope.regUser.email,
          password: $scope.regUser.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.regErrors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.regErrors[field] = error.type;
          });
        });
      }
    };
  });