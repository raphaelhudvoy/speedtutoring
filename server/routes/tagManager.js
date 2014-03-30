var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	tag : {type:String, unique: true, required:true}
});

var Tag = mongoose.model('Tag', tagSchema);

exports.getAllTags = function(callback){

    Tag.find({}, function(err, tags){
        if(err){
            callback(err);
        }else{
            callback(null, tags);
        }
    });
}

exports.getAllOfType = function (req, res) {

    var promise = new mongoose.Promise;

}

exports.createTag = function (req, callback) {
    var tag = new Tag(req.body);
    
    tag.save(function (err) {
        if (err){
            callback(err)
            // promise.resolve(err);
        }else{
            callback(null, tag)
            // promise.resolve(null, tag);
        }
    });
    // return promise;
};

exports.createIfNotExistFromQuestion = function(req,res){

	var question = req.body;
	var counter = 0, ntag = question.tags.length;
	var tags = [];

	var promise = new mongoose.Promise;

	// function processTag (tag, callback){
 //    	if(tag._id){
 //    		callback(null,{_id:mongoose.Types.ObjectId(tag._id)});
 //    	}else{
 //    		var newTag = new Tag(tag);

 //    		newTag.save(function(err){
 //    			if(err){
 //    				callback(err);
 //    			}else{
 //    				callback(null, {_id:newTag._id});
 //    			}
 //    		});
 //    	}
	// }

	// question.tags.forEach(function(tag) {
 //    	processTag(tag, function(err,newTag){
 //    		if(err){
 //    			//console.log(err);
 //                //tag already existed
 //    		}else{
 //    			tags.push(newTag);
 //    		}	
 //    		counter++;
 //    		if(counter == ntag){
 //    			question.tags = tags;
 //    			promise.resolve(null, question);
 //    		}
 //    	})
 //    });

	return promise;

}