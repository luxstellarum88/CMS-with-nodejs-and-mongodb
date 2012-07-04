
var usersModel = require('../account/users');
var dbModel = require('../Database/ConnectDB');

dbModel.connectUserDB();

exports.insertUser = function(req, res){
	var useridentity = dbModel.makeUserModel();
	var user = req.body;
	
	//add at 120704. JH
	var userModel = dbModel.tossUserModel();
	if( !userModel.findOne({Id:user.idForm}) ) {
		
		useridentity.Id = user.idForm;
		useridentity.password = user.pwForm;
		useridentity.name = user.nameForm;
		useridentity.email = user.emailForm;
		useridentity.role = 'Guest';
		
		useridentity.save(function(err){
			if(!err)
				console.log('User_inser_success');
			else
				res.redirect('/');
				
			usersModel.authenticate(user.idForm, user.pwForm, function(user){			
				if(user){
					req.session.user_id = user.Id;
					res.redirect('/board');
				}
				else{
					res.render('sessions/new', {title: 'login', locals : 
						{redir: '/board'}	
					});
				}
			});		
		});
	}
	else {
		console.log('existed ID');
		res.redirect('/');
	}
}
