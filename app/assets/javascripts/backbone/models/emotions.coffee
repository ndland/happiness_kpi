namespace "happiness_kpi", (exports) ->
  exports.emotions = Backbone.Model.extend
    defaults:
      emotion: null
      location: "Detroit"

    url: ->
      "/api/emotions"


