namespace "happiness_kpi", (exports) ->
  exports.allEmotionsCollection = Backbone.Collection.extend

    url: ->
      '/api/emotions/last5days'

    fetchEmotionJson: (callback) ->
      handleFetch = (collection, response, options) ->
        callback(collection.toJSON())
      @fetch success: handleFetch
