var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	tag : {type:String, unique: true},
	type: {type:String}
});

var Tag = mongoose.model('Tag', tagSchema);

exports.getAllTags = function(req, res){

    var promise = new mongoose.Promise;

    Tag.find({}, function(err, tags){
        if(err){
            promise.resolve(err);
        }else{
            promise.resolve(null, tags);
        }
    });

    return promise;
}

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
    			//console.log(err);
                //tag already existed
    		}else{
    			tags.push(newTag);
    		}	
    		counter++;
            console.log(counter);
    		if(counter == ntag){
    			question.tags = tags;
    			promise.resolve(null, question);
    		}
    	})
    });

	return promise;

}