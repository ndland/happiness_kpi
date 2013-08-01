namespace "happiness_kpi", (exports) ->
  exports.emotions = Backbone.Collection.extend

    url: ->
      "/api/emotions"

    fetchEmotionJson: (callback) ->
      handleFetch = (collection, response, options) ->
        callback(collection.toJSON())
      @fetch(success: handleFetch)

