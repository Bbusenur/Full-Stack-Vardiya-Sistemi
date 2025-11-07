class User < ApplicationRecord
  has_secure_password

  has_many :shift_assignments, dependent: :destroy
  has_many :shifts, through: :shift_assignments

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :role, presence: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
end
