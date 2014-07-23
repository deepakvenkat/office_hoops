var app  = {
  views : {},
  modules: {},
  loadTemplates : function (views, callback) {
    var defereds = [];
    $.each(views, function (index, view) {
      if (app[view]) {
        defereds.push($.get("templates/" + view + ".html", function (data) {
          app[view].prototype.template = _.template(data);
        }));
      } else {
        console.log(view + "not found");
      }
    });
    $.when.apply(null, defereds).done(callback);
  }
};

app.Router = Backbone.Router.extend({
  routes : {
    "" : "home",
    "/" : "home",
    "game/new" : "newGame",
    "game/:id" : "game",
    "statistics" : "showStats",
    "players" : "showPlayers"
  },

  initialize : function () {
    app.layoutView = new app.LayoutView();
    $('body').html(app.layoutView.render().el);
    this.$content = $('#main-content');
  },

  home: function () {
    $(".active").removeClass('active');
    $(".home").addClass("active");
    app.homeView = new app.HomeView();
    this.$content.html(app.homeView.render().el);
  },

  newGame : function () {
    app.gameModel = new app.GameModel();
    app.newGameView = new app.NewGameView({model: app.gameModel});
    this.$content.append(app.newGameView.render().el);
    $('#newGameModal').modal({keyboard: false});
  },

  game : function (id) {
    app.gameModel.id = id;
    app.gameView = new app.GameView({model: app.gameModel});
    this.$content.html(app.gameView.render().el);
  },

  showStats : function () {
    app.statsView = new app.StatsView({model: new app.StatsModel()});
    $(".active").removeClass('active');
    $(".stats").addClass("active");
    this.$content.html(app.statsView.render().el);
  },

  showPlayers : function () {
    app.playersView = new app.PlayersView({ collection : new app.PlayersCollection()});
    $(".active").removeClass("active");
    $(".players").addClass("active");
    this.$content.html(app.playersView.render().el);
  }
});

$(document).on("ready", function () {
  app.loadTemplates([
      "LayoutView",
      "HomeView",
      "NewGameView",
      "GameView",
      "PlayerView",
      "PlayersView",
      "PlayerProfileView",
      "WinnerView",
      "StatsView",
    ], function () {
    app.router = new app.Router();
    Backbone.history.start();
  });
});