exports.makeAlert = function(context, res) {
	var alert_script = '<script type=\'text/javascript\'>alert(\'' + context + '\');history.go(-1);</script>';
	return alert_script;
}

//error -_-
exports.makePasswordAlert = function(context, res) {
	var alert_script = '<script type=\'text/javascript\'>alert(\'' + context + '\');window.opener.reload();window.close();</script>'
	eval(alert_script);
}

exports.AlertRedirect = function(context, url, res){
	var alert_script = '<script type=\'text/javascript\'>alert(\'' + context + '\');document.href="' + url + '";</script>';
	return alert_script;
}