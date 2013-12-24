require 'rubygems'
require 'sinatra'
require 'json'
require 'unirest'
require 'mongoid'
require 'sinatra/config_file'
require 'yaml'
require 'autoinc'

####Config####
configure do
  Mongoid.load!('./config/mongoid.yml')
end


####Routes####
get '/' do
  content_type :json
  {message: "Hello World"}.to_json
end

####Models####
class User
  include Mongoid::Document
  field :username, type: String
  field :current_score, type: Integer, default: 0
  field :total_hits, type: Integer, default: 0
  field :total_shots, type: Integer, default: 0
  validates_uniqueness_of :username
end

class Game
  include Mongoid::Document
  field :name, type: String
  field :total_shots, type: Integer
  has_many :users
end