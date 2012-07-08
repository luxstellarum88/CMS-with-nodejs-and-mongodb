var dbModel = require('../Database/ConnectDB');
var alert = require('../alert/alert');
var boardOption = require('../admin/boardoption');

function display_result(result, current_page, session, page_name, board_id, res, length, type, content) {
	boardOption.getById(board_id, function(option){ //option: board_option
		if(option){
			var paging_size = option.pagingNumber;
			res.render(page_name, {
				title: 'board',
				docs: result,
				NowPage: current_page,
				paging: paging_size,
				sessionId: session,
				id: board_id,
				type: type,
				content: content,
				length : length
			});
		}//end of if
		else{
			res.redirect('/board?id='+board_id);
		}
	});//end of getById
}

exports.board_search = function(search, page_name, current_page, req, res, paging_size) {
	dbModel.connectBoardDB(search.id);
	var board_model = dbModel.tossBoardModel();
	var search_reg_exp = new RegExp(search.content,'i');
	var skip_size = (current_page*paging_size) - paging_size;
		
	if('Id' === search.type){
		board_model.find( { Id : search_reg_exp }).sort('date',-1).skip(skip_size).limit(paging_size).exec( function(err, docs) {
			if(!err) {
				board_model.find( { Id : search_reg_exp }).count(function(err, length) {
					display_result(docs, current_page, req.session.user.Id, page_name, search.id, res, length, search.type, search.content);
				});
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else if('name' === search.type) {
		board_model.find( { name : search_reg_exp }).sort('date',-1).skip(skip_size).limit(paging_size).exec( function(err, docs) {
			if(!err) {
				board_model.find( { name : search_reg_exp }).count(function(err, length) {
					display_result(docs, current_page, req.session.user.Id, page_name, search.id, res, length, search.type, search.content);
				});
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else if('subject' === search.type) {
		board_model.find( { subject : search_reg_exp }).sort('date',-1).skip(skip_size).limit(paging_size).exec(function(err, docs) {
			if(!err) {
				board_model.find( { subject : search_reg_exp }).count(function(err, length) {
					display_result(docs, current_page, req.session.user.Id, page_name, search.id, res, length, search.type, search.content);
				});
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else if('memo' === search.type) {
		board_model.find( { memo : search_reg_exp }).sort('date',-1).skip(skip_size).limit(paging_size).exec( function(err, docs) {
			if(!err) {
				board_model.find( { memo : search_reg_exp }).count(function(err, length) {
					display_result(docs, current_page, req.session.user.Id, page_name, search.id, res, length, search.type, search.content);
				});
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else {
		board_model.find( {}).sort('date',-1).skip(skip_size).limit(paging_size).exec(function(err, docs) {
			if(!err) {
				board_model.find( {}).count(function(err, length) {
					display_result(docs, current_page, req.session.user.Id, page_name, search.id, res, length, search.type, "");
				});
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
}

