var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BoardOptionIdentitySchema = new Schema({
	Id: String,
	name: String,
	pagingNumber: Number,
	boardSeq: Number,
	commentSeq: Number
});

var BoardOptionIdentityModel;



exports.connectBoardOptionDB = function(){
	mongoose.connect('mongodb://localhost/testboard');
	BoardOptionIdentityModel = mongoose.model('boardoptions', BoardOptionIdentitySchema);
}


exports.makeBoardOptionModel = function(){
	return new BoardOptionIdentityModel();
}


exports.tossBoardOptionModel = function(){
	return BoardOptionIdentityModel;
}
