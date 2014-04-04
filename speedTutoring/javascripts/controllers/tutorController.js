Tuto.controller('tutorController', ['$scope','WebSocketFactory', 'TagService', 'UserService', 'TutorService' , function ($scope, WebSocketFactory, TagService, UserService, TutorService) {

	var vm = {};
	$scope.vm = vm;
	vm.allTags=[];
	vm.myTags={};
	vm.newTag="";

	vm.suggestedTags = {};

	vm.test = "allo!";


	TagService.suggestsTag().then(function (tags) {

		for (var i = 0, tag; tag = tags[i]; i++) {
			vm.suggestedTags[tag.tag] = tag._id;
		}

	}, function (err) {

		console.log('Not abble to suggest tags');

	});

	vm.beAvailable = function () {
		WebSocketFactory.emit('availability-on', {});
	}

	vm.createTag = function(tag){
		TagService.createTag(tag, function(err, newTag){
			if(err){
				
			}else{
				vm.newTag="";
				vm.myTags[newTag.tag] = newTag._id;
				vm.saveSettings();
				
			}
		});
	}

	vm.addTag = function(tag){
		vm.myTags[tag] = vm.suggestedTags[tag]
		delete vm.suggestedTags[tag];

		vm.saveSettings();
	}

	vm.removeTag = function(tag){
		vm.suggestedTags[tag] = vm.myTags[tag]
		delete vm.myTags[tag];

		vm.saveSettings();

	}

	vm.saveSettings = function(){
		
		UserService.getCurrentUser(function(err, user){
			var tutorId = user.tutorId;
			if(err){
				console.log(err);
			}else{
				if(tutorId){

					// Converts tags to array
					var tags = [];
					for (var tag in vm.myTags) {
						tags.push({tag: tag, _id : vm.myTags[tag]});
					}


					TutorService.updateTutor(tutorId, tags, function(err, data){
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

	getTags = function(){
		UserService.getCurrentUser(function(err, user){
			var tutorId = user.tutorId;
			if(err){
				console.log(err);
			}else{
				if(tutorId){
					TutorService.getTutor(function(err, data){
						if(err){
							console.log(err);
						}else{
							for (var i = 0, tag; tag = data.tags[i]; i++) {
								vm.myTags[tag.tag] = tag._id;
							}
						}
					});
				}
			}
		});
	}

	getTags();

	
}]);