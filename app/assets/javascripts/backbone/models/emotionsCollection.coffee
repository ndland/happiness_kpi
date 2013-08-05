namespace "happiness_kpi", (exports) ->
  exports.emotionsCollection = Backbone.Collection.extend

    model: happiness_kpi.emotion

    url: ->
      "/api/emotions"

    fetchEmotionJson: (callback) ->
      handleFetch = (collection, response, options) ->
        callback(collection.toJSON())
      @fetch(success: handleFetch)

