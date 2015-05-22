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
   #take these parameters and outputs the right prediction associated with the right prediction
   #algorithm described in prediction.rb
     @prediction= Welcome.prediction(params[:day],params[:station_name],params[:train],params[:time], params[:headsign])
    puts "prediction" 
    puts  @prediction

    #only for testing
     puts "********************************"
          puts "                                 "
          puts "in prediction"
        puts  @prediction
          puts "*********************************"
  
    render json: @prediction
    
end    

#the try funtion calls the vote funtion in welcome.rb

def try

  #time = the time that the train is scheduled to arrive at the station
    @v=Welcome.vote(params[:day],params[:station_name],params[:train],params[:time], params[:headsign])
    

end 

#feedback for the website
  
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

  