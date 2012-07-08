var dbModel = require('../Database/ConnectDB');
var alert = require('../alert/alert');
var boardOption = require('../admin/boardoption');

function display_result(result, current_page, session, page_name, board_id, res) {
	boardOption.getById(board_id, function(option){ //option: board_option
		if(option){
			var paging_size = option.pagingNumber;
			res.render(page_name, {
				title: 'board',
				docs: result,
				NowPage: current_page,
				paging: paging_size,
				sessionId: session,
				id: board_id
			});
		}//end of if
		else{
			res.redirect('/board?id='+board_id);
		}
	});//end of getById
}

exports.board_search = function(search, page_name, num, req, res) {
	dbModel.connectBoardDB(search.id);
	var board_model = dbModel.tossBoardModel();
	var search_reg_exp = new RegExp(search.content,'i');	
	var result = new Array;
	
	console.log("call search " + search.id + " " + search.type + " " + search_reg_exp);
	
	if('Id' === search.type){
		board_model.find( { Id : search_reg_exp }, function(err, docs) {
			if(!err) {
				display_result(docs, num, req.session.user.Id, page_name, search.id, res);
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else if('name' === search.type) {
		console.log("name search");
		board_model.find( { name : search_reg_exp }, function(err, docs) {
			if(!err) {
				display_result(docs, num, req.session.user.Id, page_name, search.id, res);
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else if('subject' === search.type) {
		console.log("subject search");
		board_model.find( { subject : search_reg_exp }, function(err, docs) {
			if(!err) {
				display_result(docs, num, req.session.user.Id, page_name, search.id, res);
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else if('memo' === search.type) {
		console.log("memo search");
		board_model.find( { memo : search_reg_exp }, function(err, docs) {
			if(!err) {
				display_result(docs, num, req.session.user.Id, page_name, search.id, res);
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
}

