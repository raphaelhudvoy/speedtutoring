Tuto.controller('HomeController', ['$scope', 'UserService', 'TutorService', 'QuestionService', 'TagService', 'WebSocketFactory', '$location', function ($scope, UserService, TutorService, QuestionService,  TagService, WebSocketFactory, $location) {

	var vm = {};
	$scope.vm = vm;

	vm.askStep = 1;
	vm.suggestedTags = {};
	vm.selectedTags = {};
	vm.tagSearchInput = "";


	TagService.suggestsTag().then(function (tags) {

		for (var i = 0, tag; tag = tags[i]; i++) {
			vm.suggestedTags[tag.tag] = tag._id;
		}
	}, function (err) {

		console.log('Not abble to suggest tags');

	});

	vm.selectTag = function (tag) {

		vm.selectedTags[tag] = vm.suggestedTags[tag]
		delete vm.suggestedTags[tag];
	}

	vm.unselectTag = function (tag) {
		vm.suggestedTags[tag] = vm.selectedTags[tag]
		delete vm.selectedTags[tag];
	}

	vm.searchTag = function () {

		if (vm.tagSearchInput == "") {
			vm.tagSearchResults = {};
		} else {
			TagService.searchTag(vm.tagSearchInput).then(function (tags) {
				vm.tagSearchResults = {};

				for (var i = 0, tag; tag = tags[i]; i++ ) {
					vm.tagSearchResults[tag.tag] = tag._id;
				}
			}, function () {
				vm.tagSearchResults = {};
			});
		}
	}

	vm.goToStep2 = function () {
		vm.askStep = 2;
	}


}]);