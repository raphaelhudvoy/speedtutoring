Tuto.controller('HomeController', ['$scope', 'UserService', 'TutorService', 'QuestionService', 'TagService', 'WebSocketFactory', '$location', function ($scope, UserService, TutorService, QuestionService,  TagService, WebSocketFactory, $location) {

	$scope.loggedInUser = {username:""};

	var vm = {};
	$scope.vm = vm;

	vm.isTutor = false;

	vm.isAvailable = false;

	vm.toggleViewQuestions = false;

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
	vm.askedQuestion = false;
	vm.choseSubject = false;
	vm.choseTopic = false;

	vm.askStep = 1;
	vm.chooseTags = false;
	vm.isTutor = false;

	vm.tutor={tags:[]};

	vm.setAvailabilityOn = function () {
		WebSocketFactory.setAvailabilityOn();
		vm.isAvailable = true;
	}

	vm.setAvailabilityOff = function () {
		WebSocketFactory.setAvailabilityOff();
		vm.isAvailable = false;
	}

	vm.checkEnter = function(event){
		if(event.keyCode == 13){
			vm.askStep=2;
		}
	}

	vm.registerTutor = function(){
		vm.chooseTags = false;
		vm.isTutor = true;

		TutorService.registerTutor(vm.tutor).then(function (tutor) {
			alert('You are now a tutor');
		}, function (err) {
			// alert('Error: ' + err);
		});
	}

	vm.askQuestion = function (question) {

		if(!question)
			question = {"question":"Why????", tags:[{tag:"math", type:"misc"}, {tag:"physics", type:"misc"}]};


		// if(!question.tags || question.tags.length==0){
		// 	question.tags = [{tag:"math", type:"misc"}, {tag:"physics", type:"misc"}];
		// }

		vm.displayTagsSearch = false;
		vm.askedQuestion = true;


		

		$location.path("/question");

		QuestionService.askQuestion(question);

	}

	vm.viewQuestions = function(){

		vm.toggleViewQuestions = !vm.toggleViewQuestions;
		
		if(vm.toggleViewQuestions){
			QuestionService.viewQuestions().then(function(questions){
				$scope.loggedInUser.questions = questions;
			});
		}
	}

	vm.searchForTags = function () {

		if (vm.searchTags.input == "") {

			vm.searchTags.results.length = 0;

		} else {
			TagService.getAllTags().then(function (results) {

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