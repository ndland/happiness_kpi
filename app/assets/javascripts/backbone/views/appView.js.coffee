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
      @saveNewEmotion(3, null)

    undecidedSelected: ->
      @saveNewEmotion(2, null)

    sadSelected: ->
      @saveNewEmotion(1, null)

    saveNewEmotion: (emotion, callback) ->
      @emotion = new happiness_kpi.emotions
      @emotion.set emotion: emotion
      @emotion.save null, success: callback

