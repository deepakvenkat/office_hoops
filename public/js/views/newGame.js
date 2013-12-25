app.NewGameView = Backbone.View.extend({

  initialize : function () {},

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
    //Do server stuff here and then reroute to the appropriate game page
    $('#newGameModal').modal('hide');
    $('#newGameModal').on('hidden.bs.modal', function (e) {
      app.router.navigate('game/1', {trigger : true});
    })
  }
});