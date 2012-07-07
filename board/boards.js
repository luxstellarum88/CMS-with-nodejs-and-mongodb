
var dbModel = require('../Database/ConnectDB');
var boardOption = require('../admin/boardoption');

dbModel.connectBoardDB();

exports.boardview = function(req, res, board_id, PageName, num){
	boardOption.getById(board_id, function(option){ //option: board_option
		if(option){
			var board_name = option.name;
			var pagingNumber = option.pagingNumber;
			
			dbModel.connectBoardDB(board_id);
			var boardModel = dbModel.tossBoardModel();
			
			boardModel.find({}, [], function(err, docs){
				if(!err){
					res.render(PageName, {
						title: 'board',
						docs: docs,
						NowPage: num,
						paging: pagingNumber,
						sessionId: req.session.user.Id,
						id: board_id //and 120707 JH _ find target board
					});
				}
				else{
					console.log("not find");
				}	
			});
	
		}
		else
			res.redirect('/board');
	});
}

exports.findById = function(no, board_id, callback){
	dbModel.connectBoardDB(board_id);
	var boardModel = dbModel.tossBoardModel();
	
	boardModel.findOne({no:no}, function(err, docs){
			if(docs){
				callback(docs);
			}
			else{
				console.log("not find");
				callback(docs);
			}	
		});	
}
