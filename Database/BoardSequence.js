var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BoardSequenceSchema = new Schema({
	seqid: Number
});

var BoardSequenceModel;
var number;

exports.connectBoardSeqDB = function(){
	mongoose.connect('mongodb://localhost/testboardSeq');
	BoardSequenceModel = mongoose.model('boardseqs', BoardSequenceSchema);
}

exports.boardSeqNumber = function(callback){	
	BoardSequenceModel.findOne({}, function(err, docs){
		if(!err){
			number = docs.seqid;
			callback(number);
		}
		else{
			console.log('number not find');			
			callback(1);			
		}
	});	
}

exports.SeqInc = function(){
	var conditions = {seqid:number};
	var updates = {$inc:{seqid:1}};
	BoardSequenceModel.update(conditions, updates, null, null);
	console.log('inc!');
}
