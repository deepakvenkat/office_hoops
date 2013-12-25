app.PlayerView = Backbone.View.extend({

  initialize : function () {},

  className : "panel panel-default",

  events: {
    "click .hit" : "playerHit",
    "click .miss" : "playerMiss"
  },

  render : function (params) {
    this.player = params.username;
    this.currentScore = 0;
    this.$el.html(this.template({player: params.username}));
    return this;
  },

  playerHit : function (){
    this.currentScore++;
   $(".current-score", this.el).text(this.currentScore);
    app.gameView.playerAction(this.player, "hit");
  },

  playerMiss : function () {
    app.gameView.playerAction(this.player, "miss");
  }
})