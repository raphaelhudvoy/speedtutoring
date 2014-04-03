Tuto.controller('loginController', ['$scope', 'UserService', function ($scope, UserService) {

	var vm = {};
	$scope.vm = vm;
	vm.regUser = UserService.getNewRegisterUser();
	vm.user = UserService.getLoginUser();

}]);