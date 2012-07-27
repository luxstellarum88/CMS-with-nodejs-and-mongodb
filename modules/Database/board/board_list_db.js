/*
	2012. 07. 13. by JH. DB구조 수정.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	id : String,
	name : String,
	paging : Number,
	date : Date
});//end of board_list_schema

var model;

exports.connect = function(){
	mongoose.connect('mongodb://localhost/testboard');
	model = mongoose.model('board_list', schema);
}//end of connect

exports.make_model = function(){
	return new model();
}//end of make_model

exports.get_model = function(){	
	return model;
}//end of get_model
