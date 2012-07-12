/*
	2012. 07. 13. by JH
*/

var db = require('../Database/board/board_db');
var list_db = require('../Database/board/board_list_db');
db.connect();
list_db.connect();

function display_result(res, board_id, title, docs, current_page, paging_size, length, sessionId, type, content, notice){	
	res.render('boardView', {
		board_id: board_id,
		title: title,
		docs: docs,
		notice : notice,
		current_page: current_page,
		paging: paging_size,
		length: length,
		sessionId: sessionId,
		type: type,
		content: content
	});
}//end of display_result

function get_notice(req, res){
	
}//end of get_notice

exports.post = function(req, res) {
	var model = db.get_model();
	var list_model = list_db.get_model();
	var notice = new Array();
	var board_id = req.query.id; 
	
	/*
		notice part
	*/
	model.find({notice : true, deleted : false, board_id : board_id})
		.sort('date', -1).exec(function(err, docs){
		if(!err) {
			notice = docs;
		}//end of if
		else{
			console.log('in view.js : notice found fail');
		}//end of else
	}); //end of notice find
	
	/*
		posts part
	*/
	
	list_model.findOne({id : board_id}, function(err, board){		
		if(!err && board) {
			var current_page = req.query.page || 1;
			var type = req.query.type || "";
			var content = req.query.content || "";
			
			var title = board.name || "";
			var paging_size = board.paging; 
					
			var skip_size = (current_page * paging_size) - paging_size;
			
			var session_id = req.session.user.Id;
			
			var search_reg_exp = new RegExp(content);
			
			db.connect();
			var model = db.get_model();
			
			if( 'id' === type ){
				model.find({notice : false, deleted : false, user_id : search_reg_exp, board_id : board_id})
					.sort('date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
						if(!err){
							model.count({notice : false, deleted : false, user_id : search_reg_exp, board_id : board_id}, function(err, length){
								display_result(res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
							});//end of count
						}//end of if
						else {
							console.log('in view.js : error (02)');
						}//end of else
				});//end of find
			}//end of if
			else if( 'name' === type ){
				model.find({notice : false, deleted : false, name : search_reg_exp, board_id : board_id})
					.sort('date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
						if(!err){
							model.count({notice : false, deleted : false, name : search_reg_exp, board_id : board_id}, function(err, length){
								display_result(res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
							});//end of count
						}//end of if
						else {
							console.log('in view.js : error (03)');
						}//end of else
				});//end of find
			}//end of else if
			else if( 'subject' === type ){
				model.find({notice : false, deleted : false, subject : search_reg_exp, board_id : board_id})
					.sort('date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
						if(!err){
							model.count({notice : false, deleted : false, subject : search_reg_exp, board_id : board_id}, function(err, length){
								display_result(res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
							});//end of count
						}//end of if
						else {
							console.log('in view.js : error (04)');
						}//end of else
				});//end of find
			}//end of else if
			else if( 'content' === type ){
				model.find({notice : false, deleted : false, content : search_reg_exp, board_id : board_id})
					.sort('date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
						if(!err){
							model.count({notice : false, deleted : false, content : search_reg_exp, board_id : board_id}, function(err, length){
								display_result(res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
							});//end of count
						}//end of if
						else {
							console.log('in view.js : error (05)');
						}//end of else
				});//end of find
			}//end of else if
			else {
				model.find({notice : false, deleted : false, board_id : board_id})
					.sort('date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
						if(!err){
							model.count({notice : false, deleted : false, board_id : board_id}, function(err, length){
								display_result(res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
							});//end of count
						}//end of if
						else {
							console.log('in view.js : error (06)');
						}//end of else
				});//end of find
			}//end of else
		}//end of if
		else {
			console.log('in view.js : error(01)');
		}//end of else
	});//end of findOne
}//end of post
