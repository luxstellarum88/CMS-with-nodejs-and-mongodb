
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



//마우스 드래그, 우클릭 방지.
var omitformtags=["input", "textarea", "select"];
omitformtags = omitformtags.join("|");

function disableselect(e){
	if (omitformtags.indexOf(e.target.tagName.toLowerCase())==-1)
		return false;
}

function reEnable(){
	return true;
}

if (typeof document.onselectstart!="undefined")
	document.onselectstart = new Function("return false");
else{
	document.onmousedown = disableselect;
	document.onmouseup = reEnable;
}