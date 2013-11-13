var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	tag : {type:String, unique: true},
	type: {type:String}
});

var Tag = mongoose.model('Tag', tagSchema);

exports.createIfNotExistFromQuestion = function(req,res){

	var question = req.body;
	var counter = 0, ntag = question.tags.length;
	var tags = [];

	var promise = new mongoose.Promise;

	function processTag (tag, callback){
    	if(tag.id){
    		callback(null,{id:tag.id});
    	}else{
    		var newTag = new Tag(tag);

    		newTag.save(function(err){
    			if(err){
    				console.log(err);
    				callback(err);
    			}else{
    				callback(null, {id:newTag.id});
    			}
    		});
    	}
	}

	question.tags.forEach(function(tag) {
    	processTag(tag, function(err,newTag){
    		if(err){
    			console.log(err);
    		}else{
    			tags.push(newTag);
    		}	
    		counter++;
    		if(counter == ntag){
    			question.tags = tags;
    			promise.resolve(null, question);
    		}
    	})
    });

	return promise;

}