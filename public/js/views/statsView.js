app.StatsView = Backbone.View.extend({

  initialize: function() {},

  className: "container",


  events: {
    "click #stats-tab a": "showStatsTab"
  },

  render: function() {
    var view = this;
    view.model.fetch({
      type: "GET",
      success: function(d) {
        view.populateStatistics();
      }
    });
    view.$el.html(view.template);
    return this;
  },

  showStatsTab: function(e) {
    e.preventDefault();
    $(this).tab("show");
  },

  populateStatistics: function() {
    var stats = this.model.get("game_stats");
    var lastGame = new Date(stats.last_game);
    var champTemplate = "<div class=\"center\"><p>Reigning Champ</p>";
    var winners = stats.last_winner;
    for (var i = 0; i < winners.length; i++) {
      champTemplate += "<p>" + winners[i] + "</p>";
    }
    champTemplate += "<p> Date: " + lastGame.toLocaleDateString() + "</p></div>";
    $("#champ", this.el).html(champTemplate);
    var wins = this.formatd3Data(stats.wins);
    var winsTemplate = "<svg class='chart' id='wins-chart'></svg>"
    $("#wins", this.el).html(winsTemplate);
    this.drawd3BarGraph(wins, "#wins-chart");
  },

  formatd3Data: function(data) {
    var d3Data = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        d3Data.push({
          name: key,
          value: data[key]
        });
      }
    }
    return d3Data;
  },

  drawd3BarGraph: function(data, selector) {
    var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    },
      width = 420;
      height = 20 ;

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10, "%");

    var svg = d3.select(selector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x.domain(data.map(function(d) {
      return d.name;
    }));

    y.domain([0, d3.max(data, function(d) {
      return d.value;
    })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Wins");

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.name);
      })
      .attr("width", x.rangeBand())
      .attr("y", function(d) {
        return y(d.value);
      })
      .attr("height", function(d) {
        return height - y(d.value);
      });
  }
});