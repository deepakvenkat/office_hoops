app.WinnerView = Backbone.View.extend({
  initialize : function () {},

  events: {
    "click .close" : "goToHome",
    "click #closeModal" : "goToHome"
  },

  render : function () {
    this.$el.html(this.template);
    return this;
  },

  goToHome : function () {
    var view = this;
    $("#winnerModal").modal('hide');
    $("#winnerModal").on('hidden.bs.modal', function (e) {
      view.remove();
      app.router.navigate("/", {trigger: true});
    });
  }
});