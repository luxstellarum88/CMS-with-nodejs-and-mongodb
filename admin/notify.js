var email = require('mailer');

exports.Sendmail = function(sender, address, subject, content){
	var addresses = "";
	address.forEach(function(item){
		addresses = addresses + item + ", "; 
	});
	email.send({
	    host : "smtp.gmail.com",
	    port : "465",
	    ssl : true,
	    domain : "domain.com",
	    to : addresses,
	    from : sender,
	    subject : subject,
	    body: content,
	    authentication : "login",        // auth login is supported; anything else $
	    username : 'nys3909@gmail.com',
	    password : 'nys3909'
	    },
	    function(err, result){
	      if(err){ console.log(err); return;}
	      else console.log('send mail success')
	});
}