namespace "happiness_kpi", (exports) ->
  exports.appView = Backbone.View.extend

    template: HandlebarsTemplates['templates/faces']

    el: '#display'

    initialize: ->
      this.emotion = new happiness_kpi.emotions
      @render()

    events: ->
      'click #happy':     @happySelected
      'click #undecided': @undecidedSelected
      'click #sad':       @sadSelected

    render: ->
      @$el.html HandlebarsTemplates.faces()

    happySelected: ->
      this.emotion.set({ emotion: 3 })

    undecidedSelected: ->
      this.emotion.set({ emotion: 2 })

    sadSelected: ->
      this.emotion.set({ emotion: 1 })
