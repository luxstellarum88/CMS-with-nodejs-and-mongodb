var fs = require('fs');

exports.getBoardSkinList = function(callback){
	var myfiles = new Array();
	var i=0;
	fs.readdir('./views/board', function (err, files) { if ( err ) throw err;
	  files.forEach( function (file) {
	  	//console.log(file);
	    myfiles[i] = file;
	    i++;
	  });
	  //console.log(myfiles);
	  callback(myfiles);
	});
}
