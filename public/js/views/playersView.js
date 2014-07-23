app.PlayersView = Backbone.View.extend({

  initialize : function () {},

  className : "container",

  events : {

  },

  render : function () {
    var view = this;
    view.collection.fetch({
      type: "GET",
      success : function (d) {
        var players = view.collection.models;
        for (var i = 0; i < players.length; i++) {
          var player = players[i];
          var playerProfile  = new app.PlayerProfileView({model : player});
          playerProfile.render();
          $("#playerProfiles", this.$el).append(playerProfile.$el);
        }
      }
    });
    view.$el.html(view.template);
    return this;
  }
});