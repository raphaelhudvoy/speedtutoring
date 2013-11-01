Tuto.controller('homeController', ['$scope', 'UserService', 'TutorService', 'QuestionService', 'SearchService', function ($scope, UserService, TutorService, QuestionService,  SearchService) {

	$scope.loggedInUser = {username:""};

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

	vm.allTags = [ { tagID : 1, title: "Math"}
					,{ tagID : 2, title: "English"}
					,{ tagID : 3, title: "Art"}
					,{ tagID : 4, title: "Computer"}
					,{ tagID : 5, title: "Internet"}
					,{ tagID : 6, title: "Electricity"}
					,{ tagID : 7, title: "Algebra"}];

	vm.displayTagsSearch = false;
	vm.askedQuestion = false;
	vm.chooseTags = false;
	vm.isTutor = false;

	vm.tutor={};

	vm.registerTutor = function(tutor){
		vm.chooseTags = false;
		vm.isTutor = true;
		tutor.userId = $scope.loggedInUser.username;
		TutorService.registerTutor(tutor);

	}

	vm.addTags = function () {
		if (vm.question.title != "") {
			vm.displayTagsSearch = true;
		}
	}

	vm.askQuestion = function (question) {
		
		vm.displayTagsSearch = false;
		vm.askedQuestion = true;

		QuestionService.askQuestion(question);

		vm.question = {
			title 	: "",
			tags	: []
		};
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

	vm.openRegisterUser = function (){
		$scope.registerUser = true;
	}

	vm.registerUser = function(user){
		$scope.registerUser = false;
		$scope.loggedInUser = user;

		UserService.registerUser(user);

	}

	vm.dumpUserDatabase = function(){
		$scope.db = UserService.dumpUserDatabase();
	}

	vm.dumpQuestionDatabase = function(){
		QuestionService.dumpQuestionDatabase();
	}


}]);