var App = angular.module('app', [
  'ngRoute',
  'speedTutoring',
  'ui.bootstrap'
]);

App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
        templateUrl   : 'views/main',
        controller    : 'HomeController'
      }).
      when('/whiteboard', {
        templateUrl   : 'views/whiteboard',
        controller    : 'whiteboardController',
        controllerAs : 'wb'
      }).
      when('/question',{
      	templateUrl   : 'views/studentMatching',
        controller    : 'studentMatchingController'
      }).
      when('/tutorMatching',{
        templateUrl   : 'views/tutorMatching',
        controller    : 'tutorMatchingController'
      }).
      when('/tutor',{
      	templateUrl   : 'views/tutor',
        controller    : 'tutorController'
      }).
      otherwise({
        redirectTo: '/main'
     });
}]);

var Tuto = angular.module('speedTutoring', ['colorpicker.module']);
