class CreateShiftAssignments < ActiveRecord::Migration[8.1]
  def change
    create_table :shift_assignments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :shift, null: false, foreign_key: true
      t.string :status, default: "pending"
      t.text :notes

      t.timestamps
    end

    add_index :shift_assignments, [:user_id, :shift_id], unique: true
  end
end
