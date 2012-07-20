var db = require('../Database/board/board_db');
var event_emitter = require('events').EventEmitter;
var alert = require('../alert/alert');
var list_db = require('../Database/board/board_list_db');

db.connect();
list_db.connect();

var self = module.exports = {
	write_page : function(req, res) {
		var auth = 'guest';
		
		if ( 'admin' === req.session.user.role || 'superadmin' === req.session.user.Id ) {
			auth = 'admin';
		}
		
		res.render('board/write', {
			title: 'write'
			, id : req.params.id
			, auth : auth
			, session: req.session.user
		});
	}, //end of write_page
	
	insert : function(req, res) {
		var make_model = db.make_model();
		var find_model = db.get_model();
		var index = 1;
		var write_type;
	
		find_model.findOne().sort('index', -1).exec(function(err, docs){
			if ( !err ) {
				//잠적적 문제요인
				if ( docs ) index = docs.index + 1;	
		
				make_model.board_id = req.body.id;
				make_model.notice = req.body.write_type || false; 
				make_model.index = index; 
				make_model.user_name = req.session.user.name; 
				make_model.user_id = req.session.user.Id; 
				make_model.subject = req.body.subject; 
				make_model.content = req.body.tx_content; 
				make_model.hit = 0;
				make_model.insert_date = new Date();
				make_model.update_date = new Date();
				make_model.deleted = false;
				
				make_model.save(function(err) {
					if ( !err ) {
						console.log('in write.js : insert success');
					}	else {
						console.log('in write.js : insert fail');
					}
					res.redirect('/board/' + req.body.id);
				}) ;//end of save
			}//end of if
			else {
				console.log('in write.js : error(02)');
			}
		});//end of findOne
	},//end of insert
		
	check_insert_condition : function(req, res) {
		var subject = req.body.subject || "";
		var memo = req.body.tx_content || "";
		
		if ( (""!=subject) && (""!=memo) ) {
			self.insert(req, res);
		}	else {
			var alert_script = alert.makeAlert('비어있는 항목이 있습니다.');
			res.render('alert', {
				title : 'Error',
				alert : alert_script
			}) ;
		}
	}, //end of is_empty
	
	del : function(req, res) {
		var model = db.get_model();
		var comment = require('../comment/comment');
		var user_id = req.session.user.Id;
		var user_role = req.session.user.role;
		var board_id = req.params.id;
		var board_index = req.params.num;
		
		var condition = {board_id : board_id, index : board_index};
		var update = {deleted : true};
		
		comment.multi_del(board_index, function(result){
			if ( true === result ) {
				model.findOne({board_id : board_id, index : board_index},function(err, docs){
					if ( !err ) {
						if ( docs.user_id === user_id || 'superadmin' === user_id || 'admin' === user_role ) {
							model.update(condition, update, null, function(err){
								if ( !err ) {
									var alert_script = alert.AlertRedirect('삭제되었습니다..', '/board/'+board_id);
									res.render('alert', {
										title : 'Success'
										,alert : alert_script
									});//end
								}//end of if
								else {
									var alert_script = alert.makeAlert('오류가 발생했습니다.');
										res.render('alert', {
										title : 'Error'
										,alert : alert_script
									});//end of alert
								}
							}); //end of update
						}//end of if
						else {
							var alert_script = alert.makeAlert('권한이 없습니다.');
								res.render('alert', {
								title : 'Error'
								,alert : alert_script
							});//end of alert
						}//end of else
					}//end of if
					else {
						console.log('in modify.js : error(01)');
					}
				});//end of find
			}//end of if(true===result)
			else {
				console.log('in board.js : error(02)');
			}//end of else
		});//end of multi_del
	},//end of del

	board_list : function(req, res) {
		var model = list_db.get_model();
		
		model.find().sort('date', -1).exec(function(err, docs){
			if ( !err ) {
				res.render('board/main', {
					title: 'Board Main'
					, docs: docs
					, session: req.session.user
				});//end of render
			}//end of if
			else {
				console.log('in list.js : error');
			}
		});//end of find
	},//end of list
	/*
		2012. 07. 13. by JH..modify
	*/
	modify_page : function(req, res) {
		var model = db.get_model();
		
		var user_id = req.session.user.Id;
		var board_id = req.params.id;
		var board_index = req.params.num;
		
		model.findOne({board_id : board_id, index : board_index},function(err, docs){
			if ( !err ) {
				if ( docs.user_id === user_id ) {
					res.render('board/modify', {
						title: 'Board Modify'
						, docs: docs
						, session: req.session.user
					});//end of render
				}//end of if
				else {
					var alert_script = alert.makeAlert('권한이 없습니다.');
						res.render('alert', {
						title : 'Error'
						,alert : alert_script
					});//end of alert
				}//end of else
			}//end of if
			else {
				console.log('in modify.js : error(01)');
			}
		});//end of find
	},//end of show
	
	update : function(req, res) {
		var model = db.get_model();
		
		var user_id = req.session.user.Id;
		var board_id = req.body.board_id;
		var board_index = req.body.index;
		var subject = req.body.subjectForm;
		var content = req.body.memoForm;
		
		var condition = {board_id : board_id, index : board_index};
		var update = {subject : subject, content : content, update_date : new Date()};
		
		model.findOne({board_id : board_id, index : board_index},function(err, docs){
			if ( !err ) {
				if ( docs.user_id === user_id ) {
					model.update(condition, update, null, function(err){
						if ( !err ) {
							var alert_script = alert.AlertRedirect('수정되었습니다.', '/board/'+board_id);
							res.render('alert', {
								title : 'Success'
								,alert : alert_script
							});//end
						}//end of if
						else {
							var alert_script = alert.makeAlert('오류가 발생했습니다.');
								res.render('alert', {
								title : 'Error'
								,alert : alert_script
							});//end of alert
						}
					}); //end of update
				}//end of if
				else {
					var alert_script = alert.makeAlert('권한이 없습니다.');
						res.render('alert', {
						title : 'Error'
						,alert : alert_script
					});//end of alert
				}//end of else
			}//end of if
			else {
				console.log('in modify.js : error(01)');
			}
		});//end of find
	}, //end of update
	
		
	show_contents : function(req, res) {
		var model = db.get_model();
		var comment = require('../comment/comment'); 
			
		var board_id = req.params.id;
		var board_index = req.params.num;
		
		model.findOne({index : board_index, board_id : board_id}, function(err, docs){
			if ( !err ) {
				comment.list(req, res, function(comments, length){
					res.render('board/show', {
						title : 'Show Contents',
						board : docs,
						board_id : board_id,
						comment : comments,
						length : length,
						sessionId : req.session.user.Id
						, session: req.session.user
					});//end of render
				});//end of comment list
			}//end of if
			else {
				console.log('in show_contets : error(01)');
			}//end of else 
		});//end of findOne
	},//end of function
	/*
		2012. 07. 13. by JH
	*/
	display_result : function(req, res, board_id, title, docs, current_page, paging_size, length, sessionId, type, content, notice){	
		var comment = require('../comment/comment');
		var i = 0;
		var j = 0;
		var evt = new event_emitter();
		var comment_number = new Array();
		var notice_comment_number = new Array();
		
		console.log("in board.js display : " + docs.length);
		
		evt.on('notice_comment_counting', function(evt, j){
			if ( j < notice.length ) {
				comment.counter(notice[j].index, function(result) {
					notice_comment_number[j] = result;
					evt.emit('notice_comment_counting', evt, ++j);
				});//end of counter
			}//end of if
			else {
				evt.emit('comment_counting', evt, i);	
			}
		});//end of on
		
		evt.on('comment_counting', function(evt, i){
			if ( i < docs.length ) {
				comment.counter(docs[i].index, function(result) {
					comment_number[i] = result;
					evt.emit('comment_counting', evt, ++i);
				});//end of counter			
			}//end of if
			else {
				res.render('board/view', {
					board_id: board_id,
					title: title,
					docs: docs,
					notice : notice,
					current_page: current_page,
					paging: paging_size,
					length: length,
					sessionId: sessionId,
					type: type,
					content: content,
					comment_number : comment_number,
					notice_comment_number : notice_comment_number 
					, session: req.session.user
				});//end of render
			}//end of else
		});//end of evt on
		evt.emit('notice_comment_counting', evt, i);		
	},//end of display_result
	
	get_notice : function(req, res){
	},//end of get_notice
	
	post_list : function(req, res) {
		
		var model = db.get_model();
		var list_model = list_db.get_model();
		var notice = new Array();
		var board_id = req.params.id; 
		/*
			notice part
		*/
		model.find({notice : true, deleted : false, board_id : board_id})
			.sort('insert_date', -1).exec(function(err, docs){
			if ( !err ) {
				notice = docs;
			}//end of if
			else {
				console.log('in view.js : notice found fail');
			}//end of else
		}); //end of notice find
		/*
			posts part
		*/
		list_model.findOne({id : board_id}, function(err, board){		
			if ( !err && board ) {
				var current_page = req.query.page || 1;
				var type = req.query.type || "";
				var content = req.query.content || "";
								
				var title = board.name || "";
				var paging_size = board.paging; 
						
				var skip_size = (current_page * paging_size) - paging_size;
				
				var session_id = req.session.user.Id;
				
				var search_reg_exp = new RegExp(content);
									
				if ( 'id' === type ) {
					model.find({notice : false, deleted : false, user_id : search_reg_exp, board_id : board_id})
						.sort('insert_date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if ( !err ) {
								model.count({notice : false, deleted : false, user_id : search_reg_exp, board_id : board_id}, function(err, length){
									self.display_result(req, res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
								});//end of count
							}//end of if
							else {
								console.log('in view.js : error (02)');
							}//end of else
					});//end of find
				}//end of if
				else if ( 'name' === type ) {
					model.find({notice : false, deleted : false, user_name : search_reg_exp, board_id : board_id})
						.sort('insert_date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if ( !err ) {
								model.count({notice : false, deleted : false, user_name : search_reg_exp, board_id : board_id}, function(err, length){
									self.display_result(req, res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
								});//end of count
							}//end of if
							else {
								console.log('in view.js : error (03)');
							}//end of else
					});//end of find
				}//end of else if
				else if ( 'subject' === type ) {
					model.find({notice : false, deleted : false, subject : search_reg_exp, board_id : board_id})
						.sort('insert_date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if ( !err ) {
								model.count({notice : false, deleted : false, subject : search_reg_exp, board_id : board_id}, function(err, length){
									self.display_result(req, res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
								});//end of count
							}//end of if
							else {
								console.log('in view.js : error (04)');
							}//end of else
					});//end of find
				}//end of else if
				else if ( 'content' === type ) {
					model.find({notice : false, deleted : false, content : search_reg_exp, board_id : board_id})
						.sort('insert_date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if ( !err ) {
								model.count({notice : false, deleted : false, content : search_reg_exp, board_id : board_id}, function(err, length){
									self.display_result(req, res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
								});//end of count
							}//end of if
							else {
								console.log('in view.js : error (05)');
							}//end of else
					});//end of find
				}//end of else if
				else {
					model.find({notice : false, deleted : false, board_id : board_id})
						.sort('insert_date', -1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if ( !err ) {
								model.count({notice : false, deleted : false, board_id : board_id}, function(err, length){
									self.display_result(req, res, board_id, title, docs, current_page, paging_size, length, session_id, type, content, notice);
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
	},//end of post
	
	check_update_condition : function(req, res) {
		if ( (""!=req.body.subject) && (""!=req.body.memoForm) ) {
			self.update(req, res);
		}
		else {
			var alert_script = alert.makeAlert('비어있는 항목이 있습니다.');
			res.render('alert', {
				title : 'Error',
				alert : alert_script
			}) ;
		}
	}, // end of check_update_condition
		
	check_display_condition : function(req, res) {
		self.increase_hit(req.params.num, 1, function(result){
			if ( true === result ) {
				self.show_contents(req, res);
			}
			else {
				console.log('increase hit error');
			}
		}); //end of increase_hit		
	}, //end of check_display_condition
	
	increase_hit : function(index, value, callback) {
		var model = db.get_model();
		
		var condition = {index : index} ;
		var update = {$inc : {hit : value}};
		var option = null;
		
		model.update(condition, update, option, function(err) {
			if ( !err ) {
				console.log('hit increased');
				callback(true);
			}//end of if
			else {
				console.log('hit increase error');
				callback(false);
			}//end of else
		}) ;//end of update
	}//end of increase_hit
}//end of module