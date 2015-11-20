class StaticPagesController < ApplicationController

 #if the authentication cookie has been set then we can pass user on to JS Challenge, otherwise throw error
  def home
  	if cookies[:logged_in] != "cookie_set: 1234567890!@"
  		render :nothing => true, :status => 400
  	end 
  end

  #just checks to see if entered password is correct, then renders the home page
  def set_auth
  	pass = params[:password]
  	if pass == "KMP_WHERS_UR_ID"
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
  	render text: params
  end


end
