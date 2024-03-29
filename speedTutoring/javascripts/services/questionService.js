Tuto.factory('QuestionService', function ($http, $q) {

	var Service = {};

	function Question (question) {
		if (!question) {
			question = {};
		}
		this.userId = question.userId || "";
		this.question 	= question.question 	|| "?";
		this.tags 	= question.tags 	|| [];

	}


	Service.askQuestion = function (question, cb) {

		var url = "/api/v1/question/";

		$http.post(url, question).success(function(res){
			console.log("POST OF QUESTION COMPLETE", res);
			cb();
		});
	};

	Service.viewQuestions = function(){

		var deferred = $q.defer();

		var url = "/api/v1/user/questions";
		$http.get(url).success(function(questions){
			deferred.resolve(questions);
		});


		return deferred.promise;
	}

	Service.dumpQuestionDatabase = function(){
		var deferred = $q.defer();

		var url = "/api/v1/question/";

		$http.get(url).success(function(response){
			//console.log("QUESTION GET COMPLETE");
			//console.log(response);
			return response;
		});
	}


	return Service;

});