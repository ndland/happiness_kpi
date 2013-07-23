require 'spec_helper'

describe Api::EmotionsController do

  it "has a status code of 200 for given emotion" do
    get :create, emotion: 3

    response.status.should equal(200)
  end

  it "creates a new record in HappinessKpiData model" do
    get :create, emotion: 3

    HappinessKpiData.count.should eq(1)
  end

  it "stores the correct value for the emotion" do
    get :create, emotion: 2

    HappinessKpiData.first.emotion.should eq(2)
  end
end
