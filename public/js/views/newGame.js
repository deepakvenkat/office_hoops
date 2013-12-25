app.NewGameView = Backbone.View.extend({

  initialize : function () {},

  render : function () {
    this.$el.html(this.template);
    return this;
  },

  events : {
    'click #closeModal' : "goToRoot",
    'click #closeButton' : "goToRoot",
    'click #morePlayers' : "addPlayer"
  },

  goToRoot : function () {
    app.router.navigate('/');
  },

  addPlayer : function () {
    $("#game", this.el).append('<input type="text" placeholder="Username" class="form-control username">')
  }
});