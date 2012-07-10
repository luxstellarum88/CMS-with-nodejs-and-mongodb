var open_script = '<script type="text/javascript">';

exports.makeAlert = function(context, res) {
	var alert_script = '<script type=\'text/javascript\'>alert(\'' + context + '\');history.go(-1);</script>';
	return alert_script;
}

//error -_-
exports.makePasswordAlert = function(context, res) {
	var alert_script = '<script type=\'text/javascript\'>alert(\'' + context + '\');window.opener.reload();window.close();</script>'
	eval(alert_script);
}

exports.makeConfrim = function(context, res) {
	var confirm_script += '<script>';
	confirm_script += 'if (confirm("승인 하시겠습니까?")){'
  doc-ument.write("승인 완료.");
}else{
  doc-ument.write("승인 취소.");
}

</script>
