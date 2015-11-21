require 'test_helper'
require 'json'

class StaticPagesControllerTest < ActionController::TestCase

  test "should load password page" do
    get :access
    assert_response :success
  end

  test "should verify correct password" do
  	post :set_auth, :params => { :password => 'KhanAcademyRocks!' }
  	assert_response :success
  end

  #Tests for the most important part of the JSChallenge app, the check_js_code endpoint
  test "should return no white list errors, no black list errors, and passing hierarchy struct" do
  	tree = '{"type":"Program","start":0,"end":9,"body":[{"type":"VariableDeclaration","start":3,"end":9,"declarations":[{"type":"VariableDeclarator","start":7,"end":8,"id":{"type":"Identifier","start":7,"end":8,"name":"x"},"init":null}],"kind":"var"}]}'
  	white_list = []
  	black_list = []
  	structure = ["*"]

  	post :check_js_code, { 'user_code' => tree, 'white_list' => white_list.to_json,
					'black_list' => black_list.to_json, 'structure' => structure.to_json}
  	parsed_body = JSON.parse(response.body)
  	expected = {
  		'white_list' => [],
  		'black_list' => [],
  		'structure' => true,
  		'success' => true,
  	}
  	assert_equal(expected, parsed_body)
  end

  test "should return white list errors" do
  	tree = '{"type":"Program","start":0,"end":9,"body":[{"type":"VariableDeclaration","start":3,"end":9,"declarations":[{"type":"VariableDeclarator","start":7,"end":8,"id":{"type":"Identifier","start":7,"end":8,"name":"x"},"init":null}],"kind":"var"}]}'
  	white_list = ["ForStatement"]
  	black_list = []
  	structure = ["*"]

  	post :check_js_code, { 'user_code' => tree, 'white_list' => white_list.to_json,
					'black_list' => black_list.to_json, 'structure' => structure.to_json}
  	parsed_body = JSON.parse(response.body)
  	expected = {
  		'white_list' => ["ForStatement"],
  		'black_list' => [],
  		'structure' => true,
  		'success' => true,
  	}
  	assert_equal(expected, parsed_body)
  end

  test "should return white list and black list errors" do
  	tree = '{"type":"Program","start":0,"end":9,"body":[{"type":"VariableDeclaration","start":3,"end":9,"declarations":[{"type":"VariableDeclarator","start":7,"end":8,"id":{"type":"Identifier","start":7,"end":8,"name":"x"},"init":null}],"kind":"var"}]}'
  	white_list = ["ForStatement"]
  	black_list = ["VariableDeclaration"]
  	structure = ["*"]

  	post :check_js_code, { 'user_code' => tree, 'white_list' => white_list.to_json,
					'black_list' => black_list.to_json, 'structure' => structure.to_json}
  	parsed_body = JSON.parse(response.body)
  	expected = {
  		'white_list' => ["ForStatement"],
  		'black_list' => ["VariableDeclaration"],
  		'structure' => true,
  		'success' => true,
  	}
  	assert_equal(expected, parsed_body)
  end

  test "should show a failing hierarchy structure match" do
  	tree = '{"type":"Program","start":0,"end":9,"body":[{"type":"VariableDeclaration","start":3,"end":9,"declarations":[{"type":"VariableDeclarator","start":7,"end":8,"id":{"type":"Identifier","start":7,"end":8,"name":"x"},"init":null}],"kind":"var"}]}'
  	white_list = []
  	black_list = []
  	structure = ["ForStatement","*"]

  	post :check_js_code, { 'user_code' => tree, 'white_list' => white_list.to_json,
					'black_list' => black_list.to_json, 'structure' => structure.to_json}
  	parsed_body = JSON.parse(response.body)
  	expected = {
  		'white_list' => [],
  		'black_list' => [],
  		'structure' => false,
  		'success' => true,
  	}
  	assert_equal(expected, parsed_body)
  end

  test "should show a passing hierarchy structure match, given hierarchy input" do

  	tree = '{"type":"Program","start":0,"end":62,"body":[{"type":"ForStatement","start":0,"end":62,"init":{"type":"VariableDeclaration","start":4,"end":11,"declarations":[{"type":"VariableDeclarator","start":8,"end":11,"id":{"type":"Identifier","start":8,"end":9,"name":"i"},' \
  	'"init":{"type":"Literal","start":10,"end":11,"value":0,"raw":"0"}}],"kind":"var"},"test":{"type":"BinaryExpression","start":12,"end":16,"left":{"type":"Identifier","start":12,"end":13,"name":"i"},"operator":"<","right":{"type":"Literal","start":14,"end":16,"value":10,' \
  		'"raw":"10"}},"update":{"type":"UpdateExpression","start":17,"end":20,"operator":"++","prefix":false,"argument":{"type":"Identifier","start":17,"end":18,"name":"i"}},"body":{"type":"BlockStatement","start":21,"end":62,"body":[{"type":"IfStatement","start":28,"end":57' \
  			',"test":{"type":"Literal","start":31,"end":35,"value":true,"raw":"true"},"consequent":{"type":"BlockStatement","start":36,"end":57,"body":[]},"alternate":null}]}}]}'
  			
  	white_list = []
  	black_list = []
  	structure = ["ForStatement","IfStatement","*"]

  	post :check_js_code, { 'user_code' => tree, 'white_list' => white_list.to_json,
					'black_list' => black_list.to_json, 'structure' => structure.to_json}
  	parsed_body = JSON.parse(response.body)
  	expected = {
  		'white_list' => [],
  		'black_list' => [],
  		'structure' => true,
  		'success' => true,
  	}
  	assert_equal(expected, parsed_body)
  end


end
