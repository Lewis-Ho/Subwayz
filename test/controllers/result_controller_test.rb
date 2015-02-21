require 'test_helper'

class ResultControllerTest < ActionController::TestCase
  test "should get poll" do
    get :poll
    assert_response :success
  end

  test "should get result" do
    get :result
    assert_response :success
  end

end
