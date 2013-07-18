namespace "happiness_kpi", (exports) ->
  exports.appView = Backbone.View.extend

    template: HandlebarsTemplates['templates/faces']

    el: '#display'

    initialize: ->
      @render()

    events: ->
      'click #happy':     @happySelected
      'click #undecided': @undecidedSelected
      'click #sad':       @sadSelected

    render: ->
      @$el.html HandlebarsTemplates.faces()

    happySelected: ->
      3

    undecidedSelected: ->
      2

    sadSelected: ->
      1
