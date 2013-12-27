app.StatsView = Backbone.View.extend({

  initialize : function () {},

  className : "container",


  events : {
    "click #stats-tab a" : "showStatsTab"
  },

  render : function () {
    // this.model.fetch();
    this.$el.html(this.template);
    return this;
  },

  showStatsTab : function (e) {
    e.preventDefault();
    $(this).tab("show");
  }
});