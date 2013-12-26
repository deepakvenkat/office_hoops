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
    "game/:id" : "game"
  },

  initialize : function () {
    app.layoutView = new app.LayoutView();
    $('body').html(app.layoutView.render().el);
    this.$content = $('#main-content');
  },

  home: function () {
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
  }
});

$(document).on("ready", function () {
  app.loadTemplates([
      "LayoutView",
      "HomeView",
      "NewGameView",
      "GameView",
      "PlayerView",
      "WinnerView"
    ], function () {
    app.router = new app.Router();
    Backbone.history.start();
  });
});