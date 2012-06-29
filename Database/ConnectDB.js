var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardIdentitySchema = new Schema({
	no: Number,
	subject: String,
	name: String,
	memo: String,
	date: Date
});

var BoardIdentityModel;

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


