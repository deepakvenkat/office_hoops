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
  game_obj.game_date = DateTime.now
  GameStats.generate_new_stats(winner, game_obj.game_date)
  if game_obj.save!
    content_type :json
    {game: game_obj}.to_json
  end
end

get '/api/stats' do
  game_stats = GameStats.all.first
  content_type :json
  {game_stats: game_stats}.to_json
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
  field :winner, type: Array, default: []
  field :game_date, type: DateTime
end

class GameStats
  include Mongoid::Document
  field :consecutive_wins, type: Hash, default: {}
  field :last_game, type: DateTime
  field :last_winner, type: Array, default: []
  field :wins, type: Hash, default: {}

  def self.generate_new_stats(winners, date)
    game_stats = GameStats.all.first
    game_stats = GameStats.new if !game_stats
    game_stats["last_winner"] = winners
    game_stats["last_game"] = date
    winners.each do |winner|
      wins = update_consecutive_win_for(winner, game_stats)
      game_stats.consecutive_wins[winner] = wins
      if game_stats.wins[winner].nil?
        game_stats.wins[winner] = 1
      else
        game_stats.wins[winner] += 1
      end
    end
    game_stats.save!
  end

  def self.update_consecutive_win_for(winner, game_stats)
    return 1 if game_stats["consecutive_wins"][winner].nil?
    consecutive_wins = game_stats["consecutive_wins"][winner]
    games =  Game.all.desc(:game_date).limit(consecutive_wins)
    inc = 0
    games.each do |game|
      break unless game.winner.include? winner
      inc+=1
    end
    if inc == consecutive_wins
      return consecutive_wins + 1
    else
      return consecutive_wins
    end
  end
end