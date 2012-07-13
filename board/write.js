
/*
	2012. 7. 13. by JH
	새 DB 구조에 맞춰 재작성
*/

var db = require('../Database/board/board_db')
var event_emitter = require('events').EventEmitter;


exports.insert = function(req, res) {
	db.connect();
	var make_model = db.make_model();
	var find_model = db.get_model();
	var index = 1;
	var write_type;

	find_model.findOne().sort('index', -1).exec(function(err, docs){
		if(!err){
			//잠적적 문제요인
			if(docs) index = docs.index + 1;	
	
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
		else{
			console.log('in write.js : error(02)');
		}
	});//end of findOne
}//end of insert
