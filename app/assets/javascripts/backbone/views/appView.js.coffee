namespace "happiness_kpi", (exports) ->
  exports.appView = Backbone.View.extend

    template: HandlebarsTemplates['templates/faces']

    initialize: ->
      @render()

    render: ->
      HandlebarsTemplates.faces()

    selection: ->
