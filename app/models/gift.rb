class Gift < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :name
  validates_length_of :name, :within => 3..255
  validates_presence_of :user_id
end
