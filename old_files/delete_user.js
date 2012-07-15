var dbModel = require('../Database/ConnectDB');
var notify = require('../admin/notify');

exports.deleteUser = function(req){
	dbModel.connectUserDB();
	var userModel = dbModel.tossUserModel();
	var user_id = req.query.id;
	userModel.findOne({Id: user_id}, function(err, user){
		if(!err && user){
			console.log(req.session.user.Id);
			console.log(user.email);
			notify.Sendmail(
				req.session.user.name + "@goorm.org"
				, user.email
				, "Account Removed"
				,"Your account just have been removed by the administrator." );
			user.remove();
		}			
	});
}