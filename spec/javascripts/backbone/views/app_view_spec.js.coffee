#= require application

describe "App View", ->
  beforeEach ->
    @subject = new happiness_kpi.appView

  it "exists", ->
    expect(@subject).to.exist

  describe "#initialize", ->

    it "calls the render function", ->
      @subject.render = sinon.spy()

      @subject.initialize()

      sinon.assert.calledOnce @subject.render

    # it "compiles the handlebars template", ->


  describe "#render", ->

    it "has an render function", ->
      expect(@subject.render).to.exist





  # describe "#record selection", ->

  #   it "exists", ->
  #     expect(@subject.selection).to.exist

  #   it "is called when one of the faces is clicked", ->
  #     $("body").append('<input alt="happy" id="happy" src="/assets/smiley.jpg" type="image">')
  #     $("body").append('<input alt="undecided" id="undecided" src="/assets/undecided.jpg" type="image">')
  #     $("body").append('<input alt="sad" id="sad" src="/assets/sad.jpg" type="image">')
  #     @subject.selection = sinon.spy()

  #     $("#happy").click

      # sinon.assert.calledOnce(@subject.selection)







    # it "records users selection to the database", ->
    #   $("body").append('<input alt="smiley" id="smiley" src="/assets/smiley.jpg" type="image">')
    #   $("body").append('<input alt="undecided" id="undecided" src="/assets/undecided.jpg" type="image">')
    #   $("body").append('<input alt="sad" id="sad" src="/assets/sad.jpg" type="image">')

    #   $("#happy").click()
