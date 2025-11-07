class Shift < ApplicationRecord
  belongs_to :department
  has_many :shift_assignments, dependent: :destroy
  has_many :users, through: :shift_assignments

  validates :date, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validate :end_time_after_start_time

  private

  def end_time_after_start_time
    return unless start_time && end_time

    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
end
