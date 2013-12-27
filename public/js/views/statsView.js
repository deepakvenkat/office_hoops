app.StatsView = Backbone.View.extend({

  initialize : function () {},

  className : "container",


  events : {
    "click #stats-tab a" : "showStatsTab"
  },

  render : function () {
    var view = this;
    view.model.fetch({
      type: "GET",
      success: function (d) {
        view.populateStatistics();
      }
    });
    view.$el.html(view.template);
    return this;
  },

  showStatsTab : function (e) {
    e.preventDefault();
    $(this).tab("show");
  },

  populateStatistics : function () {
    var stats = this.model.get("game_stats");
    var lastGame = new Date(stats.last_game);
    var champTemplate = "<div class=\"center\"><p>Reigning Champ</p>";
    var winners = stats.last_winner;
    for (var i = 0; i < winners.length; i++) {
      champTemplate += "<p>" + winners[i] + "</p>";
    }
    champTemplate += "<p> Date: " + lastGame.toLocaleDateString() + "</p></div>";
    $("#champ", this.el).html(champTemplate);
  }
});