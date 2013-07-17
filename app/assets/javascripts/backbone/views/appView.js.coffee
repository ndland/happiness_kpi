namespace "happiness_kpi", (exports) ->
  exports.appView = Backbone.View.extend

    template: HandlebarsTemplates['templates/faces']

    el: '#display'

    initialize: ->
      @render()

    render: ->
      @$el.html HandlebarsTemplates.faces()

    selection: ->
