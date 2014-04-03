var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	tag : {type:String, unique: true, required:true}
});

var Tag = mongoose.model('Tag', tagSchema);

exports.getAllTags = function(callback){

    var query = {};
    var fields = { tag : true};
    var options = {limit : 25};

    Tag.find(query, fields, options, function(err, tags){
        if(err){
            callback(err);
        }else{
            callback(null, tags);
        }
    });
}

exports.searchForTags = function (input, callback) {

    var query = { tag : {$regex : '^'+input}};
    var fields = { tag : true};

    Tag.find(query, fields, function (err, tags) {
        if (err) {
            callback(err);
        } else {
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

exports.getTag = function(tagId, cb){
    Tag.findById(tagId, function(err, tag){
        if(err){
            cb(err);
        }else{
            cb(null, tag);
        }
    })
}

exports.getTags = function (tags, cb) {
    Tag.find({_id : { $in : tags}}, {tag : true}, function (err, tags) {
        if (err) {
            cb(err);
        } else {
            cb(null, tags);
        }
    });
}

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