var App = angular.module('app', [
  'ngRoute',
  'speedTutoring'
]);


App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
        templateUrl   : 'views/home',
        controller    : 'HomeController'
      }).
      when('/whiteboard', {
        templateUrl   : 'views/whiteboard',
        controller    : 'whiteboardController',
        controllerAs  : 'wb'
      }).
      otherwise({
        redirectTo: '/main'
     });
}]);

var Tuto = angular.module('speedTutoring', []);

Tuto.controller('HomeController', ['$scope', 'UserService', 'TutorService', 'QuestionService', 'TagService', 'WebSocketFactory', '$location', function ($scope, UserService, TutorService, QuestionService,  TagService, WebSocketFactory, $location) {

	$scope.loggedInUser = {username:""};

	var vm = {};
	$scope.vm = vm;

	vm.isTutor = false;
	UserService.isCurrentUserATutor().then(function (isTutor) {
		vm.isTutor = isTutor;
	}, function (err) { 
		console.log(err);
	});

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

	vm.allTags = [ { tagID : 1, title: "Math"}
					,{ tagID : 2, title: "English"}
					,{ tagID : 3, title: "Art"}
					,{ tagID : 4, title: "Computer"}
					,{ tagID : 5, title: "Internet"}
					,{ tagID : 6, title: "Electricity"}
					,{ tagID : 7, title: "Algebra"}];

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

	WebSocketFactory.receive('newQuestion', function(data){
		console.log("received question");
		vm.displayAvailableQuestion(data);
	});

	WebSocketFactory.receive('foundTutor', function(data){
		console.log("found a tutor");
		vm.displayTutorAccept(data);
	});

	vm.displayAvailableQuestion = function(question){
		vm.availableQuestion = question;
		vm.askStep =3;
	};

	vm.displayTutorAccept = function(tutor){
		vm.tutorAvailable = tutor;
		vm.askStep =4;
	};

	vm.questionResponse = function(response){
		vm.availableQuestion.response = response;
		WebSocketFactory.emit('questionResponse', vm.availableQuestion);
	};

	vm.tutorResponse = function(response){

		$location.path("/whiteboard");
		// vm.tutorAvailable.response = response;
		// WebSocketFactory.emit('tutorResponse', vm.tutorAvailable);
		// vm.askStep =5;
	};


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

		var p = QuestionService.askQuestion(question);

		p.then(function(tutor){
			// alert('Found tutor: '+ tutor);
		});

		vm.question = {
			title 	: "",
			tags	: []
		};

		vm.searchTags.input = "";
		vm.searchTags.results = [];
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

Tuto.controller('whiteboardController', ['WebSocketFactory', function (WebSocketFactory) {
	
	
}]);


Tuto.controller('loginController', ['$scope', 'UserService', function ($scope, UserService) {

	var vm = {};
	$scope.vm = vm;

	vm.goToRegisterUser = function () {
		vm.user = UserService.getNewRegisterUser();
		
	}

	vm.cancelRegistration = function () {
		vm.user = UserService.getLoginUser();
	}

	vm.user = UserService.getLoginUser();



}]);