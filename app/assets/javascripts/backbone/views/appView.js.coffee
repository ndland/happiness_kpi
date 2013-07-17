namespace "happiness_kpi", (exports) ->
  exports.appView = Backbone.View.extend

    template: HandlebarsTemplates['templates/faces']

    el: '#display'

    initialize: ->
      @render()

    events: ->
      'click #happy':     @emotionSelection
      'click #undecided': @emotionSelection
      'click #sad':       @emotionSelection

    render: ->
      @$el.html HandlebarsTemplates.faces()

    emotionSelection: ->
      console.log "hello"
