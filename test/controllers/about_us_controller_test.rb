require 'test_helper'

class AboutUsControllerTest < ActionController::TestCase
  setup do
    @about_u = about_us(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:about_us)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create about_u" do
    assert_difference('AboutU.count') do
      post :create, about_u: {  }
    end

    assert_redirected_to about_u_path(assigns(:about_u))
  end

  test "should show about_u" do
    get :show, id: @about_u
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @about_u
    assert_response :success
  end

  test "should update about_u" do
    patch :update, id: @about_u, about_u: {  }
    assert_redirected_to about_u_path(assigns(:about_u))
  end

  test "should destroy about_u" do
    assert_difference('AboutU.count', -1) do
      delete :destroy, id: @about_u
    end

    assert_redirected_to about_us_path
  end
end
