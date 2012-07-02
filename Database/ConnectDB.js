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
	role: String
});

var BoardIdentityModel;
var UserIdentityModel;

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



