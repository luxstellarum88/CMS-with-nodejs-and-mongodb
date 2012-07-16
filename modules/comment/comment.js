/*
	2012. 07. 13. by JH
*/

var db = require('../Database/board/comment_db');
var alert = require('../alert/alert');
var self = module.exports = {
	counter : function(condition, callback) {
		db.connect();
		var model = db.get_model();
		
		model.count({deleted : false, post_index : condition}, function(err, counter) {
			if(!err) {
				callback(counter);
			}
			else {
				console.log('in comment/count.js : error(01)');
				callback(null);
			}
		});//end of count	
	},//end of counter
	
	
	list : function(req, res, callback) {
		db.connect();
		var model = db.get_model();
		var post_index = req.query.num;
		
		var current_page = req.query.comm_page || 1;
		var paging_size = 10;
		var skip_size = (paging_size * current_page) - paging_size;
		
		model.count({deleted : false, post_index : post_index}, function(err, counter) {
			if(!err) {
				model.find({deleted : false, post_index : post_index}).sort('insert_date', -1)
					.skip(skip_size).limit(paging_size).exec( function(err, docs){
					if(!err) {
						callback(docs, counter/paging_size);
					}//end of if
					else {
						console.log('in comment/view.js : error(01)');
						callback(null, null);
					}//end of else
				});//end of find
			}//end of if
			else {
				console.log('in comment/view.js : error (02)');
			}
		});//end of count	
	},//end of list
	
	insert : function(req, res) {
		db.connect();
		var make_model = db.make_model();
		var find_model = db.get_model();
		
		var board_id = req.body.board_id;
		var post_index = req.body.board_index;
		var password = req.body.paasswordForm;
		var content = req.body.commentForm;
		
		var user_id = req.session.user.Id;
		var user_name = req.session.user.name;
			
		var index = 1;
		
		var board = require('../board/board');
		
		find_model.findOne().sort('index',-1).exec(function(err, docs){
			if(!err){
				if(docs)
					index = docs.index + 1;
				
				make_model.board_id = board_id;
				make_model.post_index = post_index;
				make_model.password = password;
				make_model.content = content;
				make_model.user_id = user_id;
				make_model.user_name = user_name;
				make_model.index = index;
				make_model.insert_date = new Date();
				make_model.udpate_date = new Date();
				make_model.deleted = false;
				
				make_model.save(function(err){
					if(!err) {
						console.log('in comment/write.js : insert success');
					}
					else {
						console.log('in comment/write.js : insert fail');
					}
					
					board.increase_hit(post_index, -1, function(result){
						if(true == result){
							res.redirect('/board?id=' + board_id + '&num=' + post_index);	
						}
						else{
							console.log('in comment.js _ insert : error');	
						}						
					});//end of board_increase_hit
				});//end of save
			}//end of if
			else {
				console.log('in comment/write.js : error(01)');
			}//end of else
		});//end of findOne
	}, //end of insert
	
	multi_del : function(post_index, callback) {
		var model = db.get_model();
		var condition = {post_index : post_index};
		var update = {deleted : true};
		var option = {multi : true};
		
		model.update(condition, update, option, function(err){
			if(!err){
				callback(true);
			}
			else {
				callback(false);
			}
		});//end of update
	}, //end of multi_del
	
	del : function(req, res){
		db.connect();
		var find_model = db.get_model();
		
		var board_id = req.query.id;
		var board_index = req.query.num;
		var index = req.query.index;
		
		var user_id = req.session.user.Id;
		
		find_model.findOne({board_id:board_id, post_index:board_index, index:index}, function(err, docs){
			if(!err && docs){
				if(docs.user_id == user_id){
					docs.remove();
					var alert_script = alert.AlertRedirect('삭제되었습니다..', '/board?id='+board_id+'&num='+board_index);								
					res.render('alert', {
						title : 'Success'
						,alert : alert_script
					});
				}
				else{
					var alert_script = alert.makeAlert('권한이 없습니다.');
					res.render('alert', {
						title: 'Error',
						alert: alert_script
					});	
				}
					
			}
			else{
				console.log('in comment/delete.js : error(01)');
				var alert_script = alert.makeAlert('찾지 못하였습니다.');
					res.render('alert', {
						title: 'Error',
						alert: alert_script
				});
			}
		});
	},
	
	update : function(req, res){
		db.connect();
		var model = db.get_model();
		
		var board_id = req.query.id;
		var post_index = req.query.num;
		var index = req.query.index;
		var content = req.query.content;
		
		var user_id = req.session.user.Id;
		
		var condition = {board_id:board_id, post_index:post_index, index:index};
		var update = {content:content, update_date:new Date()};
		
		model.findOne({board_id:board_id, post_index:post_index, index:index}, function(err, docs){
			if(!err){
				if(docs.user_id == user_id){
					model.update(condition, update, null, function(err){
						if(!err){
							var alert_script = alert.AlertRedirect('수정되었습니다.', '/board?id='+board_id+'&num='+post_index);
							res.render('alert', {
								title : 'Success'
								,alert : alert_script
							});//end						
						}
						else{
							var alert_script = alert.makeAlert('오류가 발생했습니다.');
								res.render('alert', {
								title : 'Error'
								,alert : alert_script
							});//end of alert						
						}
					});
				}
				else{
					var alert_script = alert.makeAlert('권한이 없습니다.');
					res.render('alert', {
						title : 'Error'
						,alert : alert_script
					});//end of alert
				}
			}
			else{
				console.log('in comment/update.js : (01)');
				var alert_script = alert.makeAlert('오류가 발생했습니다.');
				res.render('alert', {
					title : 'Error'
					,alert : alert_script
				});//end of alert
			}
		});
	}


}//end of modules