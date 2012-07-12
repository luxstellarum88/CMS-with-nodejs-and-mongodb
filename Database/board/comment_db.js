/*
	2012. 07. 13. by JH. DB구조 수정.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

var model;

exports.connect = function(){
	mongoose.connect('mongodb://localhost/testboard');
	model = mongoose.model('comment', schema);
}//end of connect

exports.make_model = function(){
	return new model();
}//end of make_model

exports.get_model = function(){
	return model;
}//end of get_model
