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

		if(next_level>4 || $(evt.target).attr("entered") == "true" || !$(evt.target).is("button") ){
			return;
		}

		else{
			$(evt.target).attr("entered", "true");
		}

		var component = " \
		<hr>\
		<div>\
		<div class='btn-group'> \
			  <button type='button' class='level-select levelselect-"+ String(next_level) +" btn btn-default dropdown-toggle' data-toggle='dropdown' data-level='"+ String(next_level) +"' aria-haspopup='true' aria-expanded='false'>\
			  Level "+ String(next_level) +"<span class='caret'></span>\
			  </button>\
			  </h2>\
			  <ul class='dropdown-menu level-select levelselect-"+ String(next_level) +"'>\
			    <li><a>for</a></li>\
			    <li><a>if</a></li>\
			    <li><a>switch</a></li>\
			    <li><a>declare var</a></li>\
			    <li><a>while</a></li>\
			    <li><a>using 'this'</a></li>\
			  </ul>\
			</div>\
			<h2 id='keyword-describe-"+ String(next_level) +"'> \
		</div>\
		";

		$('#structuremake').append(component);
	});


	$("#structuremake").on('click', ".dropdown-menu li a", function(evt) {
		var key_word = evt.target.innerHTML;
		var button = $(evt.target).parent().parent().parent().children('button');
		var level = $(button).data("level");
		var $description =  $(evt.target).parent().parent().parent().parent().children('h2');
		$description.html(key_word);
	});

	$('#resetstructure').click( function(evt){
		var component = " \
		<hr>\
		<div>\
		<div class='btn-group'> \
			  <button type='button' class='level-select levelselect-"+ String(0) +" btn btn-default dropdown-toggle' data-toggle='dropdown' data-level='"+ String(0) +"' aria-haspopup='true' aria-expanded='false'>\
			  Level "+ String(0) +"<span class='caret'></span>\
			  </button>\
			  </h2>\
			  <ul class='dropdown-menu level-select levelselect-"+ String(0) +"'>\
			    <li><a>for</a></li>\
			    <li><a>if</a></li>\
			    <li><a>switch</a></li>\
			    <li><a>declare var</a></li>\
			    <li><a>while</a></li>\
			    <li><a>using 'this'</a></li>\
			  </ul>\
			</div>\
			<h2 id='keyword-describe-"+ String(0) +"'> \
		</div>\
		";
		$('#structuremake').html(component);
		}
	);


} );