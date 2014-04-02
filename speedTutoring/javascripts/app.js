var App = angular.module('app', [
  'ngRoute',
  'speedTutoring'
]);

App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
        templateUrl   : 'views/home2',
        controller    : 'HomeController'
      }).
      when('/whiteboard', {
        templateUrl   : 'views/whiteboard',
        controller    : 'whiteboardController',
        controllerAs : 'wb'
      }).
      when('/question',{
      	templateUrl   : 'views/question',
        controller    : 'questionController',
        controllerAs  : 'qst'
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
