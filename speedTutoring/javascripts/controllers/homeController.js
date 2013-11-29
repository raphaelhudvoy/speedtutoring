Tuto.controller('homeController', ['$scope', 'UserService', 'TutorService', 'QuestionService', 'TagService', function ($scope, UserService, TutorService, QuestionService,  TagService) {

	$scope.loggedInUser = {username:""};

	userId = null;
	UserService.getCurrentUserId().then(function(id) {
		userId = id;
	}, function(err) {
		console.log("not abble to fecth the userID");
	});

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
	vm.choseSubject = false;
	vm.choseTopic = false;

	vm.askStep = 1;
	vm.chooseTags = false;
	vm.isTutor = false;

	vm.tutor={};

	vm.checkEnter = function(event){
		if(event.keyCode == 13){
			vm.askStep=2;
		}
	}

	vm.registerTutor = function(tutor){
		vm.chooseTags = false;
		vm.isTutor = true;
		tutor.userId = $scope.loggedInUser.username;
		TutorService.registerTutor(tutor);
	}

	vm.askQuestion = function (question) {

		question.userId = "5297f7906b58234219000001";
		if(!question)
			question = {"question":"Why????", tags:[{tag:"math", type:"misc"}, {tag:"physics", type:"misc"}]};


		if(!question.tags || question.tags.length==0){
			question.tags = [{tag:"math", type:"misc"}, {tag:"physics", type:"misc"}];
		}
		vm.displayTagsSearch = false;
		vm.askedQuestion = true;

		QuestionService.askQuestion(question);

		vm.question = {
			title 	: "",
			tags	: []
		};

		vm.searchTags.input = "";
		vm.searchTags.results = [];
	}

	vm.viewQuestions = function(){
		QuestionService.viewQuestions("5297f7906b58234219000001");
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

	vm.test = function(){

	}

}]);