#= require application

describe "App View", ->
  beforeEach ->
    $("body").append '<div class="modal" id="choices">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">Eh...</div>
    <div class="modal-body">
    <div id="display">
    </div>
    </div>
    </div>
    </div>
    </div>'
    @subject = new happiness_kpi.appView

    @callback = ->
      done()

  # afterEach ->
  #   $("body").append('<div id="display"></div>').remove()

  it 'has an el property', ->
    assert.equal(@subject.$el.selector, "#display")

  describe "#initialize", ->

    it "calls the render function", ->
      @subject.render = sinon.spy()

      @subject.initialize()

      sinon.assert.calledOnce @subject.render

  describe "#render", ->

    it "renders the 'faces' template", ->
      sinon.spy(HandlebarsTemplates, "faces")

      @subject.initialize()

      sinon.assert.calledOnce HandlebarsTemplates.faces
      HandlebarsTemplates.faces.restore()

    it 'shows the modal', ->
      @subject.render()

      expect($('#choices').data('modal').isShown).to.be.true

    it "doesn't allow you to click outside the modal to close it", ->
      @subject.render()

      $('div').click()

      expect($('#choices').data('modal').isShown).to.be.true

    it "doesn't allow you to hit the escape key to close the modal", ->
      @subject.render()

      expect($('#choices').data('modal').options.keyboard).to.be.false

  describe "#happySelected", ->

    it "is called when the happy face is clicked", ->
      sinon.spy(@subject, "happySelected")
      @subject.delegateEvents()

      $("input#happy").click()

      sinon.assert.calledOnce @subject.happySelected

    it "sets the 'value' for the emotionsCollection", ->
      @subject.saveNewEmotion(3, @callback)

      expect(@subject.emotion.get('emotion')).to.equal(3)

  describe "#undecidedSelected", ->

    it "is called when the undecided face is clicked", ->
      sinon.spy(@subject, "undecidedSelected")
      @subject.delegateEvents()

      $("input#undecided").click()

      sinon.assert.calledOnce @subject.undecidedSelected

    it "sets the 'value' for the emotionsCollection", ->
      @subject.saveNewEmotion(2, @callback)

      expect(@subject.emotion.get('emotion')).to.equal(2)

  describe "#sadSelected", ->

    it "is called when the sad face is clicked", ->
      sinon.spy(@subject, "sadSelected")
      @subject.delegateEvents()

      $("input#sad").click()

      sinon.assert.calledOnce @subject.sadSelected

    it "sets the 'value' for the emotionsCollection", ->
      @subject.saveNewEmotion(1, @callback)

      expect(@subject.emotion.get('emotion')).to.equal(1)

  describe "#saveNewEmotion", ->

    it "creates a new instance of the 'emotionsCollection' collection", ->
      @subject.saveNewEmotion(3, @callback)

      expect(@subject.emotion).to.exist

    it "sets the 'emotion' model's emotion", ->
      @subject.saveNewEmotion(3, @callback)

      expect(@subject.emotion.get('emotion')).to.equal(3)

    it 'calls the method closeModal()', ->
      sinon.spy(@subject, "closeModal")

      $("input#sad").click()

      sinon.assert.calledOnce @subject.closeModal

  describe "#closeModal", ->

    it 'closes the modal after the happy face is clicked', ->
      $("input#happy").click()

      expect($('#choices').data('modal').isShown).to.be.false

    it 'closes the modal after the undecided face is clicked', ->
      $("input#undecided").click()

      expect($('#choices').data('modal').isShown).to.be.false

    it 'closes the modal after the sad face is clicked', ->
      $("input#sad").click()

      expect($('#choices').data('modal').isShown).to.be.false
