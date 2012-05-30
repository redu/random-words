require 'rubygems'
require 'bundler/setup'
require 'middleman'
require 'rack'
require 'rack/contrib/static_cache'
require 'rack/contrib/try_static'

module Heroku
  class StaticAssetsMiddleware
    def initialize(app)
      @app = app
    end

    def call(env)
      @app.call(env)
    end
  end
end

use Rack::TryStatic,
  :root => 'build',
  :urls => ['/'],
  :try  => ['.html', 'index.html', '/index.html']

use Rack::StaticCache, :urls => ['/'], :root => 'build'
