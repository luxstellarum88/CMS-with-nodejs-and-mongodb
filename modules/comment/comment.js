/*
	2012. 07. 13. by JH
*/
var db = require('../Database/board/comment_db');
var list_db = require('../Database/board/board_list_db');
var alert = require('../alert/alert');
var self = module.exports = {
	counter : function(condition, callback) {
		db.connect();
		var model = db.get_model();
		
		model.count({deleted : false, post_index : condition}, function(err, counter) {
			if ( !err ) {
				callback(counter);
			}
			else {
				console.log('in comment/count.js : error(01)');
				callback(null);
			}
		});//end of count	
	},//end of counter
	
	get_paging_size : function(post_index, callback) {
		db.connect();
		list_db.connect();
		var comm_model = db.get_model();
		var list_model = list_db.get_model();
		comm_model.findOne({post_index : post_index}, function(err, doc){
			if(!err && doc) {
				list_model.findOne({id : doc.board_id}, function(err, board) {
					if(!err) {
						if(board) {
							callback(board.comm_paging);	
						}//end of if
						else {
							console.log('in comment.js, get_paging_size :  error(03)');
							callback(false);
						}//end of else
					}//end of if
					else {
						console.log('in comment.js, get_paging_size :  error(02)');
						callback(false);
					}//end of else
				});//end of findOne
			}
			else {
				console.log('in comment.js, get_paging_size :  error(01)');
				callback(false);
			}
		});//end of findOne
	}
	
	,list : function(req, res, callback) {
		db.connect();
		var model = db.get_model();
		var post_index = req.params.num;
		
		var current_page = req.query.comm_page || 1;
				
		self.get_paging_size(post_index, function(result){
			var paging_size = result || 5;
			var skip_size = (paging_size * current_page) - paging_size;
			
			model.count({deleted : false, post_index : post_index}, function(err, counter) {
				if ( !err ) {
					model.find({deleted : false, post_index : post_index}).sort('insert_date', 1)
						.skip(skip_size).limit(paging_size).exec( function(err, docs){
						if ( !err ) {
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
		});//end of get_paging_size
	},//end of list
	
	get_count : function(board_id, post_index, callback){
		db.connect();
		var model = db.get_model();

		model.count({deleted : false, board_id: board_id, post_index : post_index}, function(err, length){
			if(!err)
				callback(length);
			else
				console.log('in comment.js : error(04)');
		});
	},
	
	insert : function(req, res) {
		db.connect();
		var make_model = db.make_model();
		var find_model = db.get_model();
		
		var board_id = req.body.board_id;
		var post_index = req.body.board_index;
		var password = "";
		var content = req.body.commentForm;
		
		var user_id = req.session.user.Id;
		var user_name = req.session.user.name;
			
		var index = 1;
		
		var board = require('../board/board');
		
		find_model.findOne().sort('index',-1).exec(function(err, docs){
			if ( !err ) {
				if ( docs )
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
					if ( !err ) {
						console.log('in comment/write.js : insert success');
					}
					else {
						console.log('in comment/write.js : insert fail');
					}
					
					board.increase_hit(post_index, -1, function(result){
						if ( true == result ) {
							res.redirect('/board/' + board_id + '/' + post_index);	
						}
						else {
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
			if ( !err ) {
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
		
		var board_id = req.params.id;
		var board_index = req.params.num;
		var index = req.params.index;
		
		var user_id = req.session.user.Id;
		var user_role = req.session.user.role;
		
		find_model.findOne({board_id:board_id, post_index:board_index, index:index}, function(err, docs){
			if ( !err && docs ) {
				if ( docs.user_id == user_id || user_role == 'admin' ) {
					docs.remove();
					var alert_script = alert.AlertRedirect('삭제되었습니다..', '/board/'+board_id+'/'+board_index);								
					res.render(language+'/'+'alert', {
						title : 'Success'
						,alert : alert_script
					});
				}
				else {
					var alert_script = alert.makeAlert('권한이 없습니다.');
					res.render(language+'/'+'alert', {
						title: 'Error',
						alert: alert_script
					});	
				}
			}
			else {
				console.log('in comment/delete.js : error(01)');
				var alert_script = alert.makeAlert('찾지 못하였습니다.');
					res.render(language+'/'+'alert', {
						title: 'Error',
						alert: alert_script
				});
			}
		});
	},
	
	update : function(req, res){
		db.connect();
		var model = db.get_model();
		
		var board_id = req.body.board_id;
		var post_index = req.body.board_index;
		var index = req.body.index;
		var content = req.body.content || "";
		
		var user_id = req.session.user.Id;
		var user_role = req.session.user.role;
		
		var condition = {board_id:board_id, post_index:post_index, index:index};
		var update = {content:content, update_date:new Date()};
		
		model.findOne({board_id:board_id, post_index:post_index, index:index}, function(err, docs){
			console.log('docs : ' + docs);
			if ( !err && docs) {
				if ( docs.user_id == user_id || user_role == 'admin' ) {
					model.update(condition, update, null, function(err){
						if ( !err ) {
							//success : code = 0
							res.writeHead(200, {'content-type':'text/json'});
							res.write(JSON.stringify({'code':0}));
							res.end('\n');
						}
						else {
							// update fail
							res.writeHead(200, {'content-type':'text/json'});
							res.write(JSON.stringify({'code':1}));
							res.end('\n');
						}
					});
				}
				else {
					// don't have right ..
					res.writeHead(200, {'content-type':'text/json'});
					res.write(JSON.stringify({'code':2}));
					res.end('\n');
				}
			}
			else {
				// not found
				console.log('in comment/update.js : (01)');
				res.writeHead(200, {'content-type':'text/json'});
				res.write(JSON.stringify({'code':3}));
				res.end('\n');
			}
		});			
	},	

	check_ajax : function(req, res){
		var content = req.body.content || "";
		var result = 'true';
		if(content == "")
			result = 'false';
			
		res.writeHead(200, {'content-type':'text/json'});
		res.write(JSON.stringify({'result':result}));
		res.end('\n');
	}

}//end of modules