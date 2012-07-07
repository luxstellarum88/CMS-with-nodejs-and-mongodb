
var dbModel = require('../Database/Connect_Board_DB');
dbModel.connectBoardOptionDB();

exports.make = function(req, res){
	var boardModel = dbModel.makeBoardOptionModel();
	var option = req.body;
	
	boardModel.Id = option.Id;
	boardModel.name = option.name;
	boardModel.pagingNumber = option.pagingNumber;
	boardModel.boardSeq = 1;
	boardModel.commentSeq = 1;
	
	boardModel.save(function(err){
		if(!err){
			res.redirect('/admin/main');			
		}
		else{
			console.log('board_make_fail');
			res.redirect('/admin/main');
		}
	});
}
