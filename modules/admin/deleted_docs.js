var board_db = require('../Database/board/board_db');
var comment_db = require('../Database/board/comment_db');

var self = module.exports = {
	init : function () {
		
	}//end of init
	
	,get_post : function(req, callback) {
		var model = board_db.get_model();
		var paging_size = 20;
		var current_page = req.query.page || 1;
		var skip_size = (current_page * paging_size) - paging_size;
		
		model.find({deleted : true}).sort('insert_date', -1).limit(paging_size).skip(skip_size).exec(function(err,docs){
			if(!err) {
				if(docs) {
					callback(docs);
				}//end of if
				else {
					console.log('in deleted_docs, get_post : error(01)');
					callback(false);
				}//end of else
			}//end of if
			else {
				console.log('in deleted_docs, get_post : error(02)');
				callback(false);
			}//end of else
		});//end of model find
	}//end of get_post
	
	,get_comment : function(req, callback) {
		var model = comment_db.get_model();
		var paging_size = 20;
		var current_page = req.query.page || 1;
		var skip_size = (current_page * paging_size) - paging_size;
		
		model.find({deleted : true}).sort('insert_date', -1).limit(paging_size).skip(skip_size).exec(function(err,docs){
			if(!err) {
				if(docs) {
					callback(docs);
				}//end of if
				else {
					console.log('in deleted_docs, get_post : error(01)');
					callback(false);
				}//end of else
			}//end of if
			else {
				console.log('in deleted_docs, get_post : error(02)');
				callback(false);
			}//end of else
		});//end of model find
	}//end of get_comment
	
	,restore_post : function(index, callback) {
	}//end of restore_post
	
	,restore_comment : function(index, callback) {
	}//end of restore_comment
		
	,show_deleted_post : function(req, res) {
	
	}//end of show_deleted_post
	
	,show_deleted_comment : function(req, res) {
	
	}//end of show_deleted_comment
	
}// end of module export