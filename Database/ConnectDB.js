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

var BoardIdentityModel;
var UserIdentityModel;
var CommentIdentityModel;



//NYS start
exports.connectBoardDB = function(id){
	var CollectionName = 'boards_' + id +'s';
	
	mongoose.connect('mongodb://localhost/testboard');
	BoardIdentityModel = mongoose.model(CollectionName, BoardIdentitySchema);
}
//NYS end

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
