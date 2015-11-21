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
			  Level "+ String(next_level) + "▾</button> \
			  </h2>\
			  <ul class='dropdown-menu level-select levelselect-"+ String(next_level) +"'>\
			    <li><a data-key='ForStatement'>for</a></li>\
			    <li><a data-key='IfStatement'>if</a></li>\
			    <li><a data-key='SwitchStatement'>switch</a></li>\
			    <li><a data-key='VariableDeclaration'>declare var</a></li>\
			    <li><a data-key='WhileStatement'>while</a></li>\
			    <li><a data-key='ThisExpression'>using 'this'</a></li>\
			  </ul>\
			</div>\
			<h2 id='keyword-describe-"+ String(next_level) +"'> \
		</div>\
		";

		$('#structuremake').append(component);
	});


	$("#structuremake").on('click', ".dropdown-menu li a", function(evt) {
		//fetching the selected keyword and removing previous selections
		var key_word = evt.target.innerHTML;
		var $parent = $($(evt.target).parent().parent());
		$parent.children().children().removeClass("selected");

		//selecting new keyword and setting appropriate level
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
			  Level "+ String(0) +"▾</button>\
			  </h2>\
			  <ul class='dropdown-menu level-select levelselect-"+ String(0) +"'>\
			    <li><a data-key='ForStatement'>for</a></li>\
			    <li><a data-key='IfStatement'>if</a></li>\
			    <li><a data-key='SwitchStatement'>switch</a></li>\
			    <li><a data-key='VariableDeclaration'>declare var</a></li>\
			    <li><a data-key='WhileStatement'>while</a></li>\
			    <li><a data-key='ThisExpression'>using 'this'</a></li>\
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

	//accepts json payload, usually from response of API, and updates console appropriately 
	var update_console = function(json_payload){
		var console_out = "";
		var white_list = json_payload["white_list"];
		var black_list = json_payload["black_list"];
		var structure = json_payload["structure"];

		//building up console output for methods that are in white list but do not appear in program
		if(white_list.length>0){
			console_out += "ERROR - white list offendors: ";
			for(var i=0; i<white_list.length;i++){

				if(i+1 < white_list.length){
					console_out += String(white_list[i])+ ", ";
				}
				else{
					console_out += String(white_list[i] + "<br>");
				}

			}
		}
		else{
			console_out += "White List - All cases pass! <br>";
		}

		//building up console output for methods that are in program but restricted in black list
		if(black_list.length>0){
			console_out += "ERROR - black list offendors: ";
			for(var i=0; i<black_list.length;i++){

				if(i+1 < black_list.length){
					console_out += String(black_list[i])+ ", ";
				}
				else{
					console_out += String(black_list[i] + "<br>");
				}

			}
		}
		else{
			console_out += "Black List - All cases pass! <br>";
		}

		if(structure){
			console_out += "Descendant structure correct!";
		}
		else
		{
			console_out += "ERROR - No match for given descendant structure";
		}

		$('#output').html(console_out);
	};

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

			//user code on CodeMirror
			var current_code = editor.getValue();
			var ast = acorn.parse(current_code);
			var tree = JSON.stringify(ast);

			//AJAX request to our APIs where we return a response that represents suggestions for
			//user submitted JavaScript, depends on state of lists and hierarchy maker
			var jqxhr = $.post( "/check_js_code",
				{
					user_code: tree,
					white_list: JSON.stringify(white_list),
					black_list: JSON.stringify(black_list),
					structure: JSON.stringify(structure)
				})
				.done(function(resp) {
					update_console(resp);
				})
				.fail(function(resp) {
					$('#output').html("Error with API request");
				})
				.always(function(resp) {
					//pass
				});
		}
		catch(err){
			$('#output').html(err);
		}
	}

	//based on a set time interval after the user types, suggestions
	//are automatically requested to be shown in the console.
	//The request is made once the user makes a significant pause.
	var timer;
	editor.on("change", function(){
		clearTimeout(timer);
		timer = setTimeout(request_analysis, 1000)
	});
} );