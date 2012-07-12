
var db = require('../Database/board/board_db')

exports.insert = function(req, res) {
	db.connect();
	var make_model = db.make_model();
	var find_model = db.get_model();
	var index = 0;
	var write_type;
	//if(req.body.write_type === )
	
	find_model.count(function(err, counter) {
		if(!err) {
			index = counter + 1;
			
			make_model.board_id = req.body.id;
			make_model.notice = req.body.write_type || false; 
			make_model.index = index; 
			make_model.user_name = req.session.user.name; 
			make_model.user_id = req.session.user.Id; 
			make_model.subject = req.body.subject; 
			make_model.content = req.body.memo; 
			make_model.hit = 0;
			make_model.insert_date = new Date();
			make_model.update_date = new Date();
			make_model.deleted = false;
			
			make_model.save(function(err) {
				if(!err){
					console.log('in write.js : insert success');
				}
				else{
					console.log('in write.js : insert fail');
				}
				res.redirect('/board?id=' + req.body.id);
			}) ;//end of save
		}//end of if
		else {
			console.log('in write.js : error(01)');
			res.redirect('/board?id=' + req.body.id);
		}
	});//end of count
}//end of insert
