class RemoveLocationFromHappinessKpiData < ActiveRecord::Migration
  def up
    remove_column :happiness_kpi_data, :location
  end

  def down
    add_column :happiness_kpi_data, :location, :string
  end
end
