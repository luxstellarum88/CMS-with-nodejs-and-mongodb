/*
	2012. 07. 13. by JH. DB구조 수정.
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
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

var model;

exports.connect = function(){
	mongoose.connect('mongodb://localhost/testboard');
	model = mongoose.model('board', schema);
}//end of connect

exports.make_model = function(){
	return new model();
}//end of make_model

exports.get_model = function(){
	return model;
}//end of get_model
