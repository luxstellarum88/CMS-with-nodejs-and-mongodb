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
<<<<<<< HEAD
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

=======
	role: String
});

var BoardIdentityModel;
var UserIdentityModel;
>>>>>>> f5151a2e677d64a5144c020bf1e155072705dd99

exports.connectBoardDB = function(){
	mongoose.connect('mongodb://localhost/testboard');
	BoardIdentityModel = mongoose.model('boards', BoardIdentitySchema);
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



<<<<<<< HEAD
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
=======
>>>>>>> f5151a2e677d64a5144c020bf1e155072705dd99
