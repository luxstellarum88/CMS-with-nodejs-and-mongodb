
var dbModel = require('../Database/ConnectDB');
var boardOption = require('../admin/boardoption');

function display_result(res, board_id, title, docs, current_page, paging_size, length, sessionId, type, content){	
	res.render('boardView', {
		board_id: board_id,
		title: title,
		docs: docs,
		current_page: current_page,
		paging: paging_size,
		length: length,
		sessionId: sessionId,
		type: type,
		content: content
	});
}

exports.boardview = function(req, res, board_id, PageNum, type, content){
	boardOption.getById(board_id, function(option){ //option: board_option
		if(option){
			dbModel.connectBoardDB(board_id);
			var boardModel = dbModel.tossBoardModel();
			
			var title = option.name; // board_name;
			var current_page = PageNum;
			var paging_size = option.pagingNumber;
			var sessionId = req.session.user.Id;
			
			var search_reg_exp = new RegExp(content, 'i');
			
			var skip_size = (current_page*paging_size) - paging_size;
			
			if(content){
				switch(type){
					case 'Id':
						boardModel.find( {Id:search_reg_exp}).sort('date',-1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if(!err){
								boardModel.find( {Id:search_reg_exp}).count(function(err, length){
									display_result(res, board_id, title, docs, current_page, paging_size, length, sessionId, type, content);
								});
							}
							else{
								console.log('not find');
								res.redirect('/board');
							}
						});
						break;
					
					case 'name':
						boardModel.find( {name:search_reg_exp}).sort('date',-1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if(!err){
								boardModel.find( {name:search_reg_exp}).count(function(err, length){
									display_result(res, board_id, title, docs, current_page, paging_size, length, sessionId, content);
								});
							}
							else{
								console.log('not find');
								res.redirect('/board');
							}
						});
						break;
					
					case 'subject':
						boardModel.find( {subject:search_reg_exp}).sort('date',-1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if(!err){
								boardModel.find( {subject:search_reg_exp}).count(function(err, length){
									display_result(res, board_id, title, docs, current_page, paging_size, length, sessionId, type, content);
								});
							}
							else{
								console.log('not find');
								res.redirect('/board');
							}
						});
						break;
	
					case 'memo':
						boardModel.find( {memo:search_reg_exp}).sort('date',-1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if(!err){
								boardModel.find( {memo:search_reg_exp}).count(function(err, length){
									display_result(res, board_id, title, docs, current_page, paging_size, length, sessionId, type, content);
								});
							}
							else{
								console.log('not find');
								res.redirect('/board');
							}
						});
						break;
					
					default:
						// all
						boardModel.find( {}).sort('date',-1).skip(skip_size).limit(paging_size).exec(function(err, docs){
							if(!err){
								boardModel.find( {}).count(function(err, length){
									display_result(res, board_id, title, docs, current_page, paging_size, length, sessionId, type, "");
								});
							}
							else{
								console.log('not find');
								res.redirect('/board');
							}
						});
						break;
						
				}// switch end
			}
			else{ // all
				boardModel.find( {}).sort('date',-1).skip(skip_size).limit(paging_size).exec(function(err, docs){
					if(!err){
						boardModel.find( {}).count(function(err, length){
							display_result(res, board_id, title, docs, current_page, paging_size, length, sessionId, type, "");
						});
					}
					else{
						console.log('not find');
						res.redirect('/board');
					}
				});
			}
			
		}// if(option) end
		else{
			res.redirect('/board');
		}
	});
}

exports.findById = function(board_id, board_num, callback){
	dbModel.connectBoardDB(board_id);
	var boardModel = dbModel.tossBoardModel();

	boardModel.findOne({no:board_num}, function(err, docs){
			if(!err){
				result = docs;
				callback(result);
			}
			else{
				console.log("not find");
				callback(null);
			}	
		});	
}
