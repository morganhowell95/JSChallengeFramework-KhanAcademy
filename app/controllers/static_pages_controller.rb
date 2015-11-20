class StaticPagesController < ApplicationController
  def home
  	if cookies[:logged_in] != "cookie_set: 1234567890!@"
  		render :nothing => true, :status => 400
  	end 
  end


  def set_auth
  	pass = params[:password]
  	if pass == "KhanAcademyRocks!"
  		cookies[:logged_in] = "cookie_set: 1234567890!@"
  		render 'home'
  	else
  		flash.now[:danger] = 'Invalid Password'
  		render 'access'
  	end
  end

  def access

  end

end
