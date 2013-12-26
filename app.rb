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

put '/api/game/:id' do
  game = params["game"]
  winner = []
  players = game["players"]
  users = game["usernames"]
  max_score = -1
  users.each do |user|
    player = players[user]
    score = player["score"].to_i
    if score == max_score
      max_score = score
      winner << user
    elsif score > max_score
      max_score = score
      winner = []
      winner << user
    end
    user_rec = User.create_from_hash(user, score, game["rounds"].to_i)
  end
  game_obj = Game.find(game["_id"])
  game_obj.rounds = game["rounds"]
  game_obj.players = game["players"]
  game_obj.winner = winner
  if game_obj.save!
    content_type :json
    {game: game_obj}.to_json
  end
end

####Models####
class User
  include Mongoid::Document
  field :username, type: String
  field :total_hits, type: Integer, default: 0
  field :total_misses, type: Integer, default: 0
  validates_uniqueness_of :username

  def self.create_from_hash(username, score, rounds)
    user = User.find_or_create_by(username: username)
    user.total_hits += score
    user.total_misses += (rounds - 1 - score)
    user.save!
  end
end

class Game
  include Mongoid::Document
  field :name, type: String
  field :rounds, type: Integer, default: 1
  field :usernames, type: Array
  field :players, type: Hash
  field :winner, type: Array
  field :game_date, type: Date, default: Date.today
end