Tuto.controller('HomeController', ['$scope', 'UserService', 'TutorService', 'QuestionService', 'TagService', 'WebSocketFactory', '$location', function ($scope, UserService, TutorService, QuestionService,  TagService, WebSocketFactory, $location) {

	var vm = {};
	$scope.vm = vm;

	vm.askStep = 1;
	vm.suggestedTags = {};
	vm.selectedTags = {};
	vm.tagSearchInput = "";
	vm.totalTags =0;


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
		vm.totalTags++;
	}

	vm.unselectTag = function (tag) {
		vm.suggestedTags[tag] = vm.selectedTags[tag]
		delete vm.selectedTags[tag];
		vm.totalTags--;
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

	vm.checkEnter = function(event){
		if(event.keyCode == 13){
			vm.askQuestion();
		}
	}

	vm.goToStep2 = function () {
		vm.askStep = 2;
	}

	vm.askQuestion = function () {
		var question  = vm.question;

		var tags = [];

		for(tag in vm.selectedTags){
			tags.push(tag);
		}

		vm.question.tags = tags;

		if(!question)
			return;

		// if(!question.tags || question.tags.length==0){
		// 	question.tags = [{tag:"math", type:"misc"}, {tag:"physics", type:"misc"}];
		// }

		vm.displayTagsSearch = false;
		vm.askedQuestion = true;

		QuestionService.askQuestion(question, function(){
			$location.path("/question");
		});
	}

}]);