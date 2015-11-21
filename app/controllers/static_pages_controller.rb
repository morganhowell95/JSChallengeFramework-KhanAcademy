class StaticPagesController < ApplicationController
	require 'json'
 #if the authentication cookie has been set then we can pass user on to JS Challenge, otherwise throw error
  def home
  	if cookies[:logged_in] != "cookie_set: 1234567890!@"
  		render :nothing => true, :status => 400
  	end 
  end

  #just checks to see if entered password is correct, then renders the home page
  def set_auth
  	pass = params[:password]
  	if pass == "KhanAcademyRocks!"
  		cookies[:logged_in] = "cookie_set: 1234567890!@"
  		redirect_to action: "home"
  	else
  		flash.now[:danger] = 'Invalid Password'
  		render 'access'
  	end
  end

  #renders password page
  def access

  end

  #accepts an array representing the AST, where this will be checked agaisnt the white and black list
  #In addition to w/b lists, it will be checked against an enforced structure if one is set.
  def check_js_code

  	#user set paramters gathered from front end specification
  	white_list = JSON.parse(params['white_list'])
  	black_list = JSON.parse(params['black_list'])
  	structure = JSON.parse(params['structure'])
  	ast = JSON.parse(params['user_code'])

  	#response displayed back in console, where elements in reponse represent
  	#the requirements the JS code failed to meet
  	response = {"white_list" => nil, "black_list" => nil, "structure" => false}



  	ast['body'].each do |i|
  		puts "FIRST LAYER: #{i['type']}"
  	end



  	#recursively navigate potential hierarchy matches
  	def search_tree(body, index, order)
  		if index == order.length
  			return true
  		end

  		consequent = body['consequent']

  		#loop through until current body is a list of nodes
  		while not body['body'].kind_of?(Array)

  			#in the case of consequents, replace current node with deepest consequent
  			while not body['consequent'].nil?
  				body = body['consequent']
  			end

  			#in the case we have reached a lead, bubble up recursively
  			if body['body'].nil?
  				return false;
  			end

  			#if body exists and no consequents exist at this level, verify the body is an array
  			if not body['body'].kind_of?(Array)
  				body = body['body']
  			end
  		end

  		#loop until aray is found
  		# whenever next level is null, return 
  		body['body'].each do |x|
  			type = x['type']
  			p "TYPE:  #{type}"
  			p "INDEX: #{index}"
  			p "ORDER: #{order}"
  			if type == order[index]
  				if search_tree(x, index+1, order)
  					return true
  				end
  			else
  				if search_tree(x, index, order)
  					return true
  				end
  			end
  		end

  		return false
  	end

  	#start search at root with given descendant structure, ignoring wildcards
  	#ECMA TYPES:
	#ForStatement'
	#IfStatement'
	#SwitchStatement'
	#'WhileStatement'
	#'ThisExpression'
	#VariableDeclaration
  	order = structure.select {|i| i!='*'}
  	index = 0
  	p "BEFORE FUNCTION CALL\n\n\n"
  	p "ORDER: #{order}"
  	puts "********************************************\n"
  	match_found = search_tree(ast, index, order)
  	p "POST FUNCTION CALL: #{match_found}"

  	render text: match_found
  end


end
