exports.registerTutor = function(Tutor, req, res){
	var tutor = new Tutor(req.body);

	tutor.save(function (err) {
	  if (err){
	  	//fuuuuuu
	  }
	  // saved!
	});
	return res.json({test:tutor});
}