#= require application

describe "App View", ->
  beforeEach ->
    $("body").append('<div id="display"></div>')
    @subject = new happiness_kpi.appView

  afterEach ->
    $("body").append('<div id="display"></div>').remove()

  it "exists", ->
    expect(@subject).to.exist

  describe "#initialize", ->

    it "exists", ->
      expect(@subject.initialize).to.exist

    it "calls the render function", ->
      @subject.render = sinon.spy()

      @subject.initialize()

      sinon.assert.calledOnce @subject.render

  describe "#render", ->

    it "exists", ->
      expect(@subject.render).to.exist

    it "renders the 'faces' template", ->
      HandlebarsTemplates.faces = sinon.spy()

      @subject.initialize()

      sinon.assert.calledOnce HandlebarsTemplates.faces

  describe "#emotionSelection", ->

    it "exists", ->
      expect(@subject.emotionSelection).to.exist

    it "is called when the happy face is clicked", ->
      @subject.emotionSelection = sinon.spy()
      @subject.delegateEvents()

      $("input#happy").click()

      sinon.assert.calledOnce @subject.emotionSelection

    it "is called when the undecided face is clicked", ->
      @subject.emotionSelection = sinon.spy()
      @subject.delegateEvents()

      $("input#undecided").click()

      sinon.assert.calledOnce @subject.emotionSelection

    it "is called when the sad face is clicked", ->
      @subject.emotionSelection = sinon.spy()
      @subject.delegateEvents()

      $("input#sad").click()

      sinon.assert.calledOnce @subject.emotionSelection


