
function call_confirm_post(context, form_name) {
	if(confirm(context)) {
		(document.getElementsByName(form_name)[0]).submit();
	}
}

function call_confirm_get(context, parameters) {
	if(confirm(context)) {
		location.href=parameters;
	}
}

function OpenWindow(url, name, width, height) { 
	var left = (screen.width - width)/2;
	var top = (screen.height - height)/2;
	window.open(url,name,'toolbar=no,menubar=no,location=no,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left); 
}