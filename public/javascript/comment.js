function viewCommentModify(idx, content, board_id, board_index, index){
	var commentDiv = document.getElementById('c'+idx);
	var updateCommentDiv = document.getElementById('divCommentUpd');
	if( updateCommentDiv.parentNode != commentDiv){
		updateCommentDiv.parentNode.removeChild(updateCommentDiv);
		commentDiv.appendChild(updateCommentDiv);
	}
	document.updForm.content.value= content;
	document.updForm.board_id.value= board_id;
	document.updForm.board_index.value= board_index;
	document.updForm.index.value= index;
	updateCommentDiv.style.display='';
}
	
function updComment(){
	var board_id = document.updForm.board_id.value;
	var board_index = document.updForm.board_index.value;
	var index = document.updForm.index.value;
	var content = document.updForm.content.value;

	if(confirm("정말 수정하시겠습니까?"))
		location.href='/comment_update/' + board_id + '/' + board_index + '/' + index + '/' + content;
	
	hideCommentView();
}

function cnlComment(){
	hideCommentView();
}

function hideCommentView(){
	var updateCommentDiv = document.getElementById('divCommentUpd');
	updateCommentDiv.style.display='none';
	updateCommentDiv.parentNode.removeChild(updateCommentDiv);
	document.documentElement.appendChild(updateCommentDiv);
}