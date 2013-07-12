class CreateHappinessKpiData < ActiveRecord::Migration
  def change
    create_table :happiness_kpi_data do |t|
      t.integer :emotion
      t.string :location

      t.timestamps
    end
  end
end
