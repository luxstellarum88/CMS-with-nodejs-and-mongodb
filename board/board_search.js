var dbModel = require('../Database/ConnectDB');
var alert = require('../alert/alert');
dbModel.connectBoardDB();

exports.board_search = function(search, callback) {
	var board_model = dbModel.tossBoardModel();
	var search_reg_exp = '/'+search.content+'/i';	
	var type = search.type;
	var result = new Array;
	
		
	board_model.find( { type : search_reg_exp }, function(err, docs) {
		if(!err) {
			console.log("type : " + type);
			console.log("reg_exp : " + search_reg_exp);
			result = docs;
			console.log("result : " + result );
			callback(result);
		}//end of if
		else {
			console.log("search error");
		}
	});//end of find function
}//end of board_search
