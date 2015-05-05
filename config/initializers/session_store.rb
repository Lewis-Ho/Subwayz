# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store, key: '_DA_session'

def t
  cookies[:stop_times_id]= "helo"
end