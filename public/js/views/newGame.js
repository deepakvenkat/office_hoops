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
    app.router.navigate('/');
  },

  addPlayer : function () {
    $("#game", this.el).append('<input type="text" placeholder="Username" class="form-control username">')
  },

  startGame : function () {
    var params = {};
    var name = $("#gameName").val();
    if (!!name) params.name = name;
    var usernames = [];
    $(".username").each(function () {
      usernames.push(this.value);
    });
    params.usernames = usernames;
    this.model.fetch({data: params,
      type: "POST",
      success: function (d) {
        $('#newGameModal').modal('hide');
        $('#newGameModal').on('hidden.bs.modal', function (e) {
          app.router.navigate('game/1', {trigger : true});
        });
      }
    })
    //Do server stuff here and then reroute to the appropriate game page

  }
});