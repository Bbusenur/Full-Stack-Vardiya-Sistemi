class ShiftAssignment < ApplicationRecord
  belongs_to :user
  belongs_to :shift

  validates :user_id, uniqueness: { scope: :shift_id, message: "is already assigned to this shift" }
  validates :status, presence: true

  enum :status, {
    pending: "pending",
    confirmed: "confirmed",
    completed: "completed",
    cancelled: "cancelled"
  }
end
