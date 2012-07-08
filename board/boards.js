
var dbModel = require('../Database/ConnectDB');
var boardOption = require('../admin/boardoption');

dbModel.connectBoardDB();

exports.boardview = function(req, res, board_id, PageName, num){
	boardOption.getById(board_id, function(option){ //option: board_option
		if(option){
			var board_name = option.name;
			var pagingNumber = option.pagingNumber;
			var skip_size = (num*pagingNumber) - pagingNumber; //add 120708 JH
			var length;
			dbModel.connectBoardDB(board_id);
			var boardModel = dbModel.tossBoardModel();
			
			console.log(skip_size + " " + pagingNumber);
			
			//counting .. number of documents
			boardModel.find().count(function(err, docs) {
				if(!err) {
					length = docs;	
				}
				else {
					console.log("counting error");
				}
			});//end of count
			
			boardModel.find({}).sort('date',-1).skip(skip_size).limit(pagingNumber).exec( function(err, docs) {
				console.log("find 진입");
				if(!err){
					res.render(PageName, {
						title: 'board',
						docs: docs,
						NowPage: num,
						paging: pagingNumber,
						sessionId: req.session.user.Id,
						length : length,
						id: board_id //and 120707 JH _ find target board
					});
				}
				else{
					console.log("not find");
					res.redirect('/board');
				}
			});
		}
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