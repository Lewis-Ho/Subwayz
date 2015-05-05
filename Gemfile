source 'https://rubygems.org'

# Specified lRuby version 2.2.0
ruby '2.2.0'

# Added jSon
gem 'json', '~> 1.8.2'

#to calculate time difference
gem 'time_difference'

# GIS relevant gems (Google API)
gem 'gmaps4rails'
gem 'geocoder', '~> 1.2.7'
gem 'google_places'

# Adds Bootstrap CSS assets.
gem 'bootstrap-sass', '~> 3.3.4.1'
# Adds proper vendor prefixes to CSS code when compiled.
gem 'autoprefixer-rails'
# Bootstrap guide here: 
# http://www.gotealeaf.com/blog/integrating-rails-and-bootstrap-part-1

# Adds velocity.js for svg animation
gem 'velocityjs-rails', '~> 2.0.0'

# For setting environment variables
gem 'figaro'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.0'
# Use SCSS for stylesheet
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
#gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Use jquery-ui for tabbing functionality. jquery version must be >3.0.
# gem 'jquery-ui-rails'

# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

#gem 'ruby-protocol-buffers'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

 # Use mysql as the database for Active Record
  gem 'mysql2'
  gem 'yaml_db'

group :development, :test do
  
  gem 'capistrano-rails', '~> 1.1.1'
  
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :production do
  # pg has a dependency on postgresql-devel package
  # use "sudo apt-get install libpq-dev"
  gem 'pg',             '0.17.1'
  gem 'rails_12factor', '0.0.2'
end

