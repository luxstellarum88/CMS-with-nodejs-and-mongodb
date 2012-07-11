
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