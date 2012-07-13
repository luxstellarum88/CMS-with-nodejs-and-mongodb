
var dbModel = require('../Database/ConnectDB');

dbModel.connectBoardDB();

exports.deleteBoard = function(num, res){
	var __number = num;
	var boardModel = dbModel.tossBoardModel();

	
}
