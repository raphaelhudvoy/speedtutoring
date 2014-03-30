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

		$location.path("/question");

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

Tuto.controller('whiteboardController', ['WebSocketFactory', 'UserService', function (WebSocketFactory, UserService) {
	var controller = this;

	this.chat = {};

	this.chat.msg = [];
	this.chat.input = "";

	this.send_msg = function () {

		UserService.getCurrentUserId().then(function (id) { 

			WebSocketFactory.emit('chat:send', {
				user : id, msg : controller.chat.input
			}, function () {
				controller.chat.input = "";
			})
			
		}, function (err) {
			console.log('not able to send msg');
		})
	}
	

	WebSocketFactory.receive('chat:newMsg', function (msg) {
		UserService.getCurrentUserId().then(function (id) {
			if (msg.user == id) {
				msg.user = 1;
			} else {
				msg.user = 0;
			}

			controller.chat.msg.push(msg);

			$("#chat").scrollTop($("#chat")[0].scrollHeight);
		})
	})
	
}]);

Tuto.controller('questionController', ['WebSocketFactory', function (WebSocketFactory) {

	this.love;
	
}]);

Tuto.controller('tutorController', ['$scope','WebSocketFactory', 'TagService', 'UserService', 'TutorService' , function ($scope, WebSocketFactory, TagService, UserService, TutorService) {

	var vm = {};
	$scope.vm = vm;
	vm.allTags=[];
	vm.myTags=[];
	vm.newTag="";

	vm.createTag = function(tag){
		TagService.createTag(tag, function(err, newTag){
			if(err){
				
			}else{
				vm.newTag="";
				vm.myTags.push(newTag);
				TagService.getAllTags().then(function(tags){
					vm.allTags = tags;
				});
			}
		});
	}

	vm.addTag = function(tag){
		var flag = false;
		for(var i=0; i<vm.myTags.length; i++){
			if(vm.myTags[i].tag == tag.tag){
				flag =true;
				break;
			}
		}
		if(!flag){
			vm.myTags.push(tag);
		}
	}

	vm.removeTag = function(tag){
		for(var i=0; i<vm.myTags.length; i++){
			if(vm.myTags[i].tag == tag.tag){
				vm.myTags.splice(i,1);
			}
		}
	}

	vm.saveSettings = function(){
		
		UserService.getCurrentUser(function(err, user){
			var tutorId = user.tutorId;
			if(err){
				console.log(err);
			}else{
				if(tutorId){
					TutorService.updateTutor(tutorId, vm.myTags, function(err, data){
						if(err){
							console.log(err);
						}else{

						}
					});
				}else{
					var newTutor = {};
					newTutor.userId = user.id;
					newTutor.tags = vm.myTags;

					TutorService.registerTutor(newTutor, function(err, data){
						if(err){
							console.log(err);
						}else{

						}
					});
				}
			}
		});
	}

	TagService.getAllTags().then(function(tags){
		vm.allTags = tags;
	});

	getTags = function(){
		UserService.getCurrentUser(function(err, user){
			var tutorId = user.tutorId;
			if(err){
				console.log(err);
			}else{
				if(tutorId){
					TutorService.getTutor(tutorId, function(err, data){
						if(err){
							console.log(err);
						}else{
							vm.myTags = data.tags;
						}
					});
				}
			}
		});
	}

	getTags();

	
}]);

Tuto.controller('loginController', ['$scope', 'UserService', function ($scope, UserService) {

	var vm = {};
	$scope.vm = vm;
	vm.regUser = UserService.getNewRegisterUser();
	vm.user = UserService.getLoginUser();

}]);