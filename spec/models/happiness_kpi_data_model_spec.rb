require 'spec_helper'

describe HappinessKpiData do

  it "Validates that there is a value for emotion" do
    HappinessKpiData.create(:emotion => 2).should be_valid
  end

  it "Doesn't create the model when there is no emotion specified" do
    HappinessKpiData.create(:emotion => nil).should_not be_valid
  end
end
