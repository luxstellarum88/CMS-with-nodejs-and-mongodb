var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
	2012. 07. 13. by JH. DB구조 수정.
*/

var board_schema = new Schema({
	board_id : String,
	notice : Boolean,
	index : Number,
	user_name : String,
	user_id : String,
	subject : String,
	content : String,
	hit : Number,
	insert_date : Date,
	update_date : Date,
	deleted : Boolean
});//end of board_schema

var board_list_schema = new Schema({
	id : String,
	name : String,
	date : Date
});//end of board_list_schema

var comment_schema = new Schema({
	board_id : String,
	post_index : Number,
	index : Number,
	user_name : String,
	user_id : String,
	content : String,
	insert_date : Date,
	update_date : Date,
	password : String,
	deleted : Boolean
});//end of comment_schema

var recent_comment_model;


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


var BoardIdentitySchema = new Schema({
	no: Number,
	Id: String,
	subject: String,
	name: String,
	memo: String,
	date: Date,
	hit: Number
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
	no : Number,
	hit: Number
});

//공지사항용

var notice_board_schema = new Schema({
	no: Number,
	id: String,
	subject: String,
	name: String,
	memo: String,
	date: Date,
	hit: Number
});

//공지사항 코맨트

var notice_comment_schema = new Schema({
	boardNo: Number,
	commId: Number,
	Id: String,
	name : String, //왜 comment에 누락되어있었지?
	password: String,
	comment: String,
	date: Date //얜 필요없나?
});


/*
 *  at 2012 07 12 by JH. Recent Comment Schema
*/
var recent_comment_schema = new Schema({
	no: Number,
	boardNo: Number,
	subject : String,
	board_id : String,
	Id: String,
	name : String, 
	password: String,
	comment: String,
	notice: Boolean,
	date: Date
});


var BoardIdentityModel;
var UserIdentityModel;
var CommentIdentityModel;
var board_recent_model;
var notice_board_model;
var recent_comment_model;


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


//공지사항용
exports.connect_notice_board = function(id){
	var name = id +'_notices';
	
	mongoose.connect('mongodb://localhost/testboard');
	notice_board_model = mongoose.model(name, notice_board_schema);
}

exports.make_notice_board_model = function(){
	return new notice_board_model();
}

exports.toss_notice_board_model = function(){
	return notice_board_model;	
}


//공지사항 코멘트용
exports.connect_notice_comment = function(id){
	var name = id + '_notice_comments';
	mongoose.connect('mongodb://localhost/testboard');
	notice_comment_model = mongoose.model(name, notice_comment_schema);
}

exports.make_notice_comment_model = function(){
	return new notice_comment_model();
}

exports.toss_notice_comment_model = function(){
	return notice_comment_model;	
}

/*
	2012 07 12 by JH. for recent_comment_board
*/
exports.connect_recent_comment = function(id){
	mongoose.connect('mongodb://localhost/testboard');
	recent_comment_model = mongoose.model('recent_comments', recent_comment_schema);
}

exports.make_recent_comment_model = function(){
	return new recent_comment_model();
}

exports.toss_recent_comment_model = function(){
	return recent_comment_model;	
}