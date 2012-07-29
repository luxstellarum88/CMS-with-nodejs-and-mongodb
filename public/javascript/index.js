function show_notice() {
	document.getElementById("boardTitleNews").className = "";
	document.getElementById("boardTitleNotice").className = "first select";
	document.getElementById("news").style.display = "none";
	document.getElementById("notice").style.display = "";
}//end of show_notice

function show_news() {
	document.getElementById("boardTitleNews").className = "select";
	document.getElementById("boardTitleNotice").className = "first";
	document.getElementById("news").style.display = "";
	document.getElementById("notice").style.display = "none";
	
}//end of show_news

function goto_notice() {
	location.href = '/board/notice';
}

function goto_news() {
	location.href = '/board/news';
}
