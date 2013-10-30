Tuto.controller('homeController', ['$scope', 'UserService'], function ($scope, UserService) {

	scope.vm = {};

	vm.test = function () {
		UserService.registerUser().then(function(results) {

		}, function (err) {

		});
	}

});