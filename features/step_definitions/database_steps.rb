Given('veritabanı temizlendi') do
  DatabaseCleaner.clean_with(:truncation)
end

Given('aşağıdaki departmanlar mevcut:') do |table|
  table.hashes.each do |row|
    Department.find_or_create_by!(name: row['name']) do |dept|
      dept.description = row['description']
    end
  end
end

Given('aşağıdaki kullanıcılar mevcut:') do |table|
  table.hashes.each do |row|
    User.find_or_create_by!(email: row['email']) do |user|
      user.name = row['name']
      user.role = row['role']
      user.password = '123456'
    end
  end
end

Given('aşağıdaki vardiyalar mevcut:') do |table|
  table.hashes.each do |row|
    department = Department.find_by!(name: row['department'])
    Shift.find_or_create_by!(
      date: Date.parse(row['date']),
      start_time: Time.parse(row['start_time']),
      end_time: Time.parse(row['end_time']),
      department: department
    )
  end
end

Given('"{string}" adlı bir çalışan mevcut') do |name|
  @user = User.find_by!(name: name)
end

Given('"{string}" adlı bir departman mevcut') do |name|
  @department = Department.find_by!(name: name)
end

Given('"{string}" email\'ine sahip bir çalışan mevcut') do |email|
  @user = User.find_or_create_by!(email: email) do |u|
    u.name = 'Test User'
    u.role = 'employee'
    u.password = '123456'
  end
end

Given('"{string}" çalışanı {int} vardiyaya atanmış') do |name, count|
  user = User.find_by!(name: name)
  count.times do |i|
    shift = Shift.create!(
      date: Date.today + i.days,
      start_time: Time.parse('09:00'),
      end_time: Time.parse('17:00'),
      department: Department.first || Department.create!(name: 'Test Dept')
    )
    ShiftAssignment.create!(
      user: user,
      shift: shift,
      status: 'confirmed'
    )
  end
end

Given('"{string}" çalışanı bir vardiyaya "{string}" durumunda atanmış') do |name, status|
  user = User.find_by!(name: name)
  shift = Shift.first || Shift.create!(
    date: Date.today,
    start_time: Time.parse('09:00'),
    end_time: Time.parse('17:00'),
    department: Department.first || Department.create!(name: 'Test Dept')
  )
  @shift_assignment = ShiftAssignment.create!(
    user: user,
    shift: shift,
    status: status
  )
end

Given('"{string}" tarihinde "{string}" - "{string}" saatleri arasında bir vardiya mevcut') do |date, start_time, end_time|
  @shift = Shift.find_or_create_by!(
    date: Date.parse(date),
    start_time: Time.parse(start_time),
    end_time: Time.parse(end_time),
    department: Department.first || Department.create!(name: 'Test Dept')
  )
end

Given('"{string}" tarihinde bir vardiya mevcut') do |date|
  @shift = Shift.find_by!(date: Date.parse(date))
  expect(@shift).not_to be_nil
end

Given('aşağıdaki çalışanlar mevcut:') do |table|
  table.hashes.each do |row|
    User.find_or_create_by!(email: row['email']) do |user|
      user.name = row['name']
      user.role = row['role']
      user.password = '123456'
    end
  end
end

Given('aşağıdaki departmanlar mevcut:') do |table|
  table.hashes.each do |row|
    Department.find_or_create_by!(name: row['name']) do |dept|
      dept.description = row['description']
    end
  end
end

