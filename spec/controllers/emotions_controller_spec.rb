require 'spec_helper'

# TODO need to change these tests to match for post.
# will be a create method. Remove location tests.

describe Api::EmotionsController do
  before do
    @emotion = Fabricate(:happiness_kpi_data)
  end

  it "has a status code of 200 for given emotion" do
    get :create, id: @emotion.id

    response.status.should equal(200)
  end

  it "renders a json for the emotions" do
    get :create, id: @emotion.id

    theJson = JSON.parse(response.body)
    theJson["emotion"].should eq(@emotion.emotion)
  end

  # it "renders both the location and the emotion" do
  #   get :show, id: @emotion.id

  #   theJson = JSON.parse(response.body)

  #   theJson.should have_key("emotion")
  #   theJson.should have_key("location")

  #   theJson.should_not have_key("created_at")
  #   theJson.should_not have_key("updated_at")
  # end
end
