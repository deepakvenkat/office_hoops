app.PlayerProfileView = Backbone.View.extend({

  initialize : function () {},

  className : "col-sm-6 col-md-4",

  events : {},

  render : function () {
    this.playerProfile = this.model.attributes;
    this.$el.html(this.template({player : this.playerProfile}));
    return this;
  }
});