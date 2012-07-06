var dbModel = require('../Database/ConnectDB');
var alert = require('../alert/alert');
dbModel.connectBoardDB();

exports.board_search = function(search, callback) {
	var board_model = dbModel.tossBoardModel();
	var search_reg_exp = new RegExp(search.content,'i');	
	var result = new Array;
	
	if('Id' === search.type)
	{
		board_model.find( { Id : search_reg_exp }, function(err, docs) {
			if(!err) {
				result = docs;
				callback(result);
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else if('name' === search.type) {
		board_model.find( { name : search_reg_exp }, function(err, docs) {
			if(!err) {
				result = docs;
				callback(result);
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else if('subject' === search.type) {
		board_model.find( { subject : search_reg_exp }, function(err, docs) {
			if(!err) {
				result = docs;
				callback(result);
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else if('memo' === search.type) {
		board_model.find( { memo : search_reg_exp }, function(err, docs) {
			if(!err) {
				result = docs;
				callback(result);
			}//end of if
			else {
				console.log("search error");
			}
		});//end of find function
	}
	else{
		console.log("search error");
	}
}//end of board_search
