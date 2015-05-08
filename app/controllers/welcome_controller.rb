class WelcomeController < ApplicationController
  require 'google_places'
  require 'rubygems'
  require 'open-uri'
  require 'json'
  require 'time_difference'
  require 'date'
  require 'time'
  include  StopTimesHelper
  
  def index
     
  end



















  


def prediction_alg
    
   puts "prediction" 
 
     @prediction= Welcome.prediction(params[:day],params[:station_name],params[:train],params[:time], params[:headsign])
    puts "prediction" 
    puts  @prediction

     puts "********************************"
          puts "                                 "
          puts "in prediction"
        puts  @prediction
          puts "*********************************"
  
    render json: @prediction
    
end    


def try


    @v=Welcome.vote(params[:day],params[:station_name],params[:train],params[:time], params[:headsign])
    

end 

  
  
  def create
    @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    @alt = params[:alt].to_f
  end

  def submit_feedback
    @user_email = params[:replyTo]
    @mail_body = params[:textarea]

    Feedback.send_feedback(@user_email, @mail_body).deliver_now
  
    render none: true;
  end

end

  