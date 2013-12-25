app.GameView = Backbone.View.extend({

  initialize : function () {},

  render : function () {
    this.currentRound = 1;
    this.players = [{
      username: "testplayer1"
    },
    {
      username : "testplayer2"
    },
    {
      username : "testplayer3"
    }]

    this.game = {
      players : {
        "testplayer1" : {
          score : 0,
          next : "testplayer2"
        },

        "testplayer2" : {
          score : 0,
          next : "testplayer3"
        },

        "testplayer3" : {
          score : 0 ,
        },
      }
    }
    this.$el.html(this.template);

    for (var i = 0; i < this.players.length; i++) {
      var player = this.players[i];
      var playerView = new app.PlayerView();
      playerView.render({username: player.username});

      $("#accordion", this.$el).append(playerView.$el);
    }
    $("#" + this.players[0].username, this.$el).addClass("in");
    return this;
  },

  playerAction : function (player, action) {
    $("#" + player, this.el).collapse("toggle");
    if (action === "hit") this.game.players[player].score += 1;

    var nextPlayer = this.game.players[player].next;
    if (!nextPlayer) {
      this.currentRound++;
      $(".round", this.el).text(this.currentRound);
      var nextPlayer = this.players[0].username;
    }
    $("#" + nextPlayer, this.el).collapse("toggle");
  }
});