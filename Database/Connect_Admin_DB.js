var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SuperUserIdentitySchema = new Schema({
	Id: String,
	password: String,
	name: String,
});

var SuperUserIdentityModel;


exports.connectSuperUserDB = function(){
	mongoose.connect('mongodb://localhost/testboard');
	SuperUserIdentityModel = mongoose.model('superusers', SuperUserIdentitySchema);
}

exports.tossSuperUserModel = function(){
	return SuperUserIdentityModel;	
}


