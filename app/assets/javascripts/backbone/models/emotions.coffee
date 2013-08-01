namespace "happiness_kpi", (exports) ->
  exports.emotions = Backbone.Collection.extend

    url: ->
      "/api/emotions"
