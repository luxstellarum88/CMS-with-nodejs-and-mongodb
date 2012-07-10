var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardIdentitySchema = new Schema({
	no: Number,
	Id: String,
	subject: String,
	name: String,
	memo: String,
	date: Date
});

var UserIdentitySchema = new Schema({
	Id: String,
	password: String,
	name: String,
	email: String,
	role: String
});

var CommentIdentitySchema = new Schema({
	boardNo: String,
	commId: String,
	Id: String,
	password: String,
	comment: String
});

//최신글 추적을 위해 추가
var board_recent_schema = new Schema({
	board_id : String,
	board_no : Number,
	id : String,
	subject : String,
	content : String,
	name : String,
	date : Date,
	no : Number
});

var BoardIdentityModel;
var UserIdentityModel;
var CommentIdentityModel;
var board_recent_model;

exports.connectBoardDB = function(id){
	var CollectionName = 'board_' + id +'s';
	
	mongoose.connect('mongodb://localhost/testboard');
	BoardIdentityModel = mongoose.model(CollectionName, BoardIdentitySchema);
}

exports.makeBoardModel = function(){
	return new BoardIdentityModel();
}

exports.tossBoardModel = function(){
	return BoardIdentityModel;	
}


exports.connectUserDB = function(){
	mongoose.connect('mongodb://localhost/testboard');
	UserIdentityModel = mongoose.model('Users', UserIdentitySchema);
}

exports.makeUserModel = function(){
	return new UserIdentityModel();
}

exports.tossUserModel = function(){
	return UserIdentityModel;	
}



exports.connectCommentDB = function(){
	mongoose.connect('mongodb://localhost/testboard');
	CommentIdentityModel = mongoose.model('Comments', CommentIdentitySchema);
}

exports.makeCommentModel = function(){
	return new CommentIdentityModel();
}

exports.tossCommentModel = function(){
	return CommentIdentityModel;	
}


//최신글 관리 게시판
exports.connect_board_recent_db = function(){
	mongoose.connect('mongodb://localhost/testboard');
	board_recent_model = mongoose.model('board_recents', board_recent_schema);
}

exports.make_board_recent_model = function(){
	return new board_recent_model();
}

exports.toss_board_recent_model = function(){
	return board_recent_model;	
}

