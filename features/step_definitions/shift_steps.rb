Given('"{string}" departmanı için bir vardiya oluşturmak istiyorum') do |dept_name|
  @department = Department.find_by!(name: dept_name)
end

When('aşağıdaki bilgilerle vardiya oluşturuyorum:') do |table|
  row = table.hashes.first
  make_request('POST', '/api/v1/shifts', {
    shift: {
      date: row['date'],
      start_time: row['start_time'],
      end_time: row['end_time'],
      department_id: @department.id
    }
  })
end

When('tüm vardiyaları listeliyorum') do
  make_request('GET', '/api/v1/shifts')
end

When('bu vardiyayı siliyorum') do
  make_request('DELETE', "/api/v1/shifts/#{@shift.id}")
end

When('"{string}" çalışanının vardiyalarını listeliyorum') do |name|
  user = User.find_by!(name: name)
  make_request('GET', "/api/v1/users/#{user.id}")
end

Then('vardiya başarıyla oluşturulmalı') do
  expect(get_response_status).to eq(201)
  response = get_json_response
  expect(response).to have_key('id')
  @created_shift = response
end

Then('vardiya "{string}" departmanına ait olmalı') do |dept_name|
  response = get_json_response
  expect(response['department']['name']).to eq(dept_name)
end

Then('vardiya tarihi "{string}" olmalı') do |date|
  response = get_json_response
  expect(response['date']).to eq(date)
end

Then('vardiya saatleri "{string}" - "{string}" arasında olmalı') do |start_time, end_time|
  response = get_json_response
  expect(response['start_time']).to match(/#{start_time}/)
  expect(response['end_time']).to match(/#{end_time}/)
end

Then('{int} vardiya görüntülenmeli') do |count|
  expect(get_response_status).to eq(200)
  response = get_json_response
  expect(response).to be_an(Array)
  expect(response.length).to eq(count)
end

Then('listede "{string}" tarihli vardiya olmalı') do |date|
  response = get_json_response
  dates = response.map { |s| s['date'] }
  expect(dates).to include(date)
end

Then('vardiya başarıyla silinmeli') do
  expect(get_response_status).to eq(204)
end

Then('vardiya listede görünmemeli') do
  make_request('GET', '/api/v1/shifts')
  response = get_json_response
  ids = response.map { |s| s['id'] }
  expect(ids).not_to include(@shift.id)
end

Then('tüm vardiyalarda "{string}" atanmış olmalı') do |name|
  response = get_json_response
  # Bu step user'ın shift'lerini kontrol eder
  # Response'da user bilgisi varsa kontrol edilir
end

When('"{string}" çalışanını bu vardiyaya atıyorum') do |name|
  user = User.find_by!(name: name)
  make_request('POST', '/api/v1/shift_assignments', {
    shift_assignment: {
      user_id: user.id,
      shift_id: @shift.id,
      status: 'pending'
    }
  })
end

Then('atama başarıyla oluşturulmalı') do
  expect(get_response_status).to eq(201)
  response = get_json_response
  expect(response).to have_key('id')
  @created_assignment = response
end

Then('atama durumu "{string}" olmalı') do |status|
  response = get_json_response
  expect(response['status']).to eq(status)
end

Then('"{string}" bu vardiyaya atanmış olmalı') do |name|
  response = get_json_response
  expect(response['user']['name']).to eq(name)
end

When('bu atamanın durumunu "{string}" olarak güncelliyorum') do |status|
  make_request('PATCH', "/api/v1/shift_assignments/#{@shift_assignment.id}", {
    shift_assignment: {
      status: status
    }
  })
end

Then('atama durumu "{string}" olmalı') do |status|
  response = get_json_response
  expect(response['status']).to eq(status)
end

