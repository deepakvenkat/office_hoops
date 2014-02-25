app.NewGameView = Backbone.View.extend({

  initialize : function () {},

  className : "newGame",

  render : function () {
    this.$el.html(this.template);
    return this;
  },

  events : {
    'click #closeModal' : "goToRoot",
    'click #closeButton' : "goToRoot",
    'click #morePlayers' : "addPlayer",
    'click #start-game' : "startGame"
  },

  goToRoot : function () {
    var view = app.newGameView;
    $("#newGameModal").modal("hide");
    $("#newGameModal").on('hidden.bs.modal', function (e) {
      view.remove();
      app.router.navigate("/", {trigger: true});
    });
  },

  addPlayer : function () {
    $("#game", this.el).append('<input type="text" placeholder="Username" class="form-control username">');
  },

  startGame : function () {
    var params = {};
    var name = $("#gameName").val();
    var rounds = $("#rounds").val();
    if (!!name) params.name = name;
    var usernames = [];
    $(".username").each(function () {
      usernames.push(this.value);
    });
    params.usernames = usernames;
    params.rounds = rounds;
    this.model.fetch({data: params,
      type: "POST",
      success: function (d) {
        var id = d.attributes.game["_id"];
        $('#newGameModal').modal('hide');
        $('#newGameModal').on('hidden.bs.modal', function (e) {
          app.router.navigate('game/' + id, {trigger : true});
        });
      }
    });
  }
});