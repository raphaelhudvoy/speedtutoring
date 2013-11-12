Tuto.controller('loginController', ['$scope', 'UserService', function ($scope, UserService) {

	var vm = {};
	$scope.vm = vm;

	vm.registerUser = function () {
		vm.user = UserService.getNewRegisterUser();
	}

	vm.cancelRegistration = function () {
		vm.user = UserService.getLoginUser();
	}

	vm.user = UserService.getLoginUser();



}]);