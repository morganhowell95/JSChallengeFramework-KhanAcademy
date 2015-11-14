/* This will be the majority of the javascript that communicates with the Rails API
 *which will use a Javascript parser to send relevant information over
 *= require jquery
 *= require jquery_ujs
 *= require_tree .''
 *= require codemirror
 *= require codemirror/modes/javascript
 *= require bootstrap
*/

$(document).ready( function(){

	var editor = CodeMirror.fromTextArea($('#editor')[0], {
	  textWrapping: true,
	  lineNumbers: true
	});

	$("#whitelist").click(function(evt) {
		$(evt.target).toggleClass('success');
	});

	$("#blacklist").click(function(evt) {
		$(evt.target).toggleClass('danger');
	});

	$("#resetlist").click(function(evt) {
		$('td').removeClass('danger');
		$('td').removeClass('success');
	});

	$("#structuremake").on('click', ".level-select",function(evt) {
		var prev_level = parseInt($(evt.target).data("level"));
		var next_level = prev_level+1;
		if(next_level>4 || $(evt.target).prop("entered") == "true"){
			return;
		}
		else{
			$(evt.target).attr("entered", "true");
		}
		console.log(next_level);

		var component = " \
		<hr>\
		<div class='btn-group'> \
			  <button type='button' class='level-select levelselect-"+ String(next_level) +" btn btn-default dropdown-toggle' data-toggle='dropdown' data-level='"+ String(next_level) +"' aria-haspopup='true' aria-expanded='false'>\
			  Level "+ String(next_level) +"<span class='caret'></span>\
			  </button>\
			  <ul class='dropdown-menu'>\
			    <li><a>for</a></li>\
			    <li><a>if</a></li>\
			    <li><a>switch</a></li>\
			    <li><a>declare var</a></li>\
			    <li><a>while</a></li>\
			    <li><a>using 'this'</a></li>\
			  </ul>\
			</div>\
		";

		$('#structuremake').append(component);
	});


} );