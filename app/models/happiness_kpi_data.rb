class HappinessKpiData < ActiveRecord::Base
  attr_accessible :emotion, :location

  validates :emotion, :presence => true
end
