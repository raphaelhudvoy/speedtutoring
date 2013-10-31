Tuto.controller('homeController', ['$scope', 'UserService', 'SearchService', function ($scope, UserService, SearchService) {

	var vm = {};
	$scope.vm = vm;

	vm.question = {
		title 	: "",
		tags	: []
	}

	vm.searchTags = {
		results : [],
		input : ""
	}

	vm.tags = {

		add : function (tag) {
			vm.question.tags.push(tag);

		}
	}

	vm.displayTagsSearch = false;

	vm.addTags = function () {
		if (vm.question.title != "") {
			vm.displayTagsSearch = true;
		}
	}

	vm.askQuestion = function () {
		displayTagsSearch = false;
	}

	vm.searchForTags = function () {

		if (vm.searchTags.input == "") {

			vm.searchTags.results.length = 0;

		} else {
			SearchService.searchForTags(vm.searchTags.input).then(function (results) {

				vm.searchTags.results.length = 0;

				for (var i = 0, n = results.length; i < n; i++ ) {
					vm.searchTags.results.push(results[i]);
				}

			}, function (err) {

			});
		}
	}



}]);