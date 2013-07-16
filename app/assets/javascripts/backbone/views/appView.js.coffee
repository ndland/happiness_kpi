namespace "happiness_kpi", (exports) ->
  exports.appView = Backbone.View.extend

    # templateName: 'faces'
    template: HandlebarsTemplates['templates/faces']

    initialize: ->
      @render()

    # events:
    #   "click #happy" : "selection"

    render: ->
      source = faces
      console.log "source:", source
      # template = Handlebars.compile(source)

    selection: ->
      console.log "selection was called"
