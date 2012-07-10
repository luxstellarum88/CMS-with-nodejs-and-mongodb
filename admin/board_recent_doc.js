/*
	JH. 2012. 7. 10~
*/

var boardoption_db_model = ('../Database/Connect_Board_DB');
var db_model = ('../Database/ConnectDB');

function find_recent_doc () {
	boardoption_db_model.connectBaordOptionDB();
	var board_model = boardoption_db_model.tossBoardOptionModel();
	
	
	board_model.find({},['Id'], function(err, board_list){
		if(!err) {
			board_model.count({},function(err, length){
				for( var i = 0; i < length; i++ ) {
					db_model.connectBoardDB(board_list[i]);
					var board = db_model.tossBoardModel();
					
				}//end of for
			});//end of board_model count
		}//end of if(!err)
		else{
			
		}//end of else
	});//end of board_model find

}//end of function
