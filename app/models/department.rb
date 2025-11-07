class Department < ApplicationRecord
  has_many :shifts, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
