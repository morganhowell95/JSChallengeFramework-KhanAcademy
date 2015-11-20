/* This will be the majority of the javascript that communicates with the Rails API
 *which will use a Javascript parser to send relevant information over
 *= require jquery
 *= require jquery_ujs
 *= require_tree .''
 *= require codemirror
 *= require codemirror/modes/javascript
 *= require bootstrap
 *= require acorn/dist/acorn
*/


$(document).ready( function(){

	//instance that represents codemirror text editor
	var editor = CodeMirror.fromTextArea($('#editor')[0], {
	  textWrapping: true,
	  lineNumbers: true
	});

	//all keywords that must appear in code
	$("#whitelist").click(function(evt) {
		$(evt.target).toggleClass('success');
	});

	//all keywords that are banned from showing in the code
	$("#blacklist").click(function(evt) {
		$(evt.target).toggleClass('danger');
	});

	//button to reset all restrictions
	$("#resetlist").click(function(evt) {
		$('td').removeClass('danger');
		$('td').removeClass('success');
	});

	//GUI for enforcing a particular structure on the supplied code
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
			    <li><a data-key='for'>for</a></li>\
			    <li><a data-key='if'>if</a></li>\
			    <li><a data-key='switch'>switch</a></li>\
			    <li><a data-key='var'>declare var</a></li>\
			    <li><a data-key='while'>while</a></li>\
			    <li><a data-key='this'>using 'this'</a></li>\
			  </ul>\
			</div>\
			<h2 id='keyword-describe-"+ String(next_level) +"'> \
		</div>\
		";

		$('#structuremake').append(component);
	});


	$("#structuremake").on('click', ".dropdown-menu li a", function(evt) {
		var key_word = evt.target.innerHTML;
		$(evt.target).addClass("selected");
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
			    <li><a data-key='for'>for</a></li>\
			    <li><a data-key='if'>if</a></li>\
			    <li><a data-key='switch'>switch</a></li>\
			    <li><a data-key='var'>declare var</a></li>\
			    <li><a data-key='while'>while</a></li>\
			    <li><a data-key='this'>using 'this'</a></li>\
			  </ul>\
			</div>\
			<h2 id='keyword-describe-"+ String(0) +"'> \
		</div>\
		";
		$('#structuremake').html(component);
		}
	);

	//indicate that user feedback is being processed or waiting for a response
	window.setInterval(function(){ 
		var progress_dots = $('#progress').html().length;
		progress_dots++;
		progress_dots = (progress_dots+1)%5;
		if (progress_dots == 0) progress_dots+=2;
		var new_status = Array(progress_dots).join(".");
		$('#progress').html(new_status);
	}, 1000);

	//Function that sends JavaScript data off to the APIs within our Rails controllers
	//API will respond by giving some helpful advice, depending on supplied parameters
	var request_analysis = function(){

		//Acorn will throw a syntax error if one is found
		try{

			//collecting all keywords listed within the white list
			var white_list = [];
			$('td.success').each( function(index, value){
				white_list.push($(value).data('key'));
			});

			//collectiong all keywords listed within the black list
			var black_list = [];
			$('td.danger').each( function(index, value){
				black_list.push($(value).data('key'));
			});

			//collecting a set structure hierarchy, if one exists
			var structure = [];
			$('#structuremake .btn-group').each( function(index, value){
				var selected_keyword = $(value).find('.selected').data('key');
				if(selected_keyword){
					structure.push(selected_keyword);
				}
				else{
					//when structure level not specified, we will assume wildcard
					structure.push("*");
				}
			});

			console.log(structure);



			var current_js = editor.getValue();
			ast = acorn.parse(current_js);
			
			

			//ajax request to our APIs where we return a response that represents response for
			//user submitted JavaScript
			var jqxhr = $.post( "/check_js_code",
				{
					name: "John",
					time: "bout damn late"
				})
				.done(function(resp) {
				alert( resp );
				})
				.fail(function(resp) {
				alert( "error" );
				})
				.always(function(resp) {
				alert( "complete" );
				});
		}
		catch(err){
			$('#output').html(err);
		}
	}


	//ast = acorn.parse("var function();");
	//console.log(ast);

	//based on a set time interval after the user types, suggestions
	//are automatically requested to be shown in the console.
	//The request is made once the user makes a significant pause.
	var timer;
	editor.on("change", function(){
		clearTimeout(timer);
		timer = setTimeout(request_analysis, 1000)
	});




} );