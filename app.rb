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
set :views, Proc.new { File.join(root, "public") }

####Routes####
get '/' do
  send_file 'public/index.html'
end

post '/api/game' do
  puts "in here"
  usernames = params["usernames"]
  players = {}
  i = 0
  while i < usernames.length do
    username = usernames[i]
    players[username] = {}
    players[username]["score"] = 0
    players[username]["next"] = usernames[i + 1] if i < (usernames.length - 1)
    i = i + 1
  end
  game_params = params
  game_params["players"] = players
  game = Game.new(game_params)
  if game.save!
    content_type :json
    {game: game}.to_json
  else
    puts error
  end
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
  field :rounds, type: Integer, default: 0
  field :usernames, type: Array
  field :players, type: Hash
end