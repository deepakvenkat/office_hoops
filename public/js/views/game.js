app.GameView = Backbone.View.extend({

  initialize : function () {},

  events : {
    "click #end-game" : "endGame"
  },

  render : function () {
    if (!this.model) {
      app.router.navigate("/", {trigger: true});
      return;
    }
    var game = this.model.attributes.game;
    var players = game.usernames;
    game.current_round = 1;
    this.$el.html(this.template);

    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      var playerView = new app.PlayerView();
      playerView.render({username: player});

      $("#accordion", this.$el).append(playerView.$el);
    }
    $("#" + players[0], this.$el).addClass("in");
    return this;
  },

  playerAction : function (player, action) {
    var params = this.model.attributes.game;
    $("#" + player, this.el).collapse("toggle");
    if (action === "hit") {
      params.players[player].score += 1;
      params.players[player].current_consecutive += 1;
      if (params.players[player].max_consecutive < params.players[player].current_consecutive) {
        params.players[player].max_consecutive = params.players[player].current_consecutive;
      }
    } else {
      params.players[player].current_consecutive = 0;
      params.players[player].misses += 1;
    }

    var nextPlayer = params.players[player].next;
    if (!nextPlayer) {
      if (params.current_round >= params.rounds) {
        var winner = this.checkForWinner();
        if (winner.length === 1) {
          this.endGame();
        } else if (winner.length > 1) {
          for (var i = 0; i < winner.length; i++) {
            if (i === winner.length - 1) {
              params.players[winner[i]].next = undefined;
              nextPlayer = winner[0];
            } else {
              params.players[winner[i]].next = winner[i + 1];
            }
          }
        }
      } else {
        $(".round", this.el).text(++params.current_round);
        nextPlayer = params.usernames[0];
      }
    }
    $("#" + nextPlayer, this.el).collapse("toggle");
  },

  endGame : function () {
    var view = app.gameView;
    $(".in", view.$el).collapse("toggle");
    $("#end-game").button("loading");
    view.model.fetch({
      data: {
        game: view.model.get('game')
      },
      type: "PUT",
      success: function(model, response, options) {
        var winnerView = new app.WinnerView();
        $("#main-content").append(winnerView.render().el);
        var winners = response.game.winner;
        for (var i = 0; i < winners.length; i++)
          $(".winners").append("<p>" + winners[i] + "</p><br/>");
        $("#end-game").button("reset");
        $("#winnerModal").modal({keyboard: false});
      }
    });
  },

  checkForWinner : function () {
    var maxScore = -1;
    var winners = [],
        username,
        player,
        params = this.model.get('game');
    for(var i = 0; i < params.usernames.length; i++) {
      username = params.usernames[i];
      player = params.players[username];
      if (player.score > maxScore) {
        winners = [];
        winners.push(username);
        maxScore = player.score;
      } else if (player.score === maxScore) {
        winners.push(username);
      }
    }
    return winners;
  }
});