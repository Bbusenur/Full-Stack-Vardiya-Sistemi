Given('yeni bir çalışan oluşturmak istiyorum') do
  # Bu step sadece intent belirtir, action When step'inde yapılır
end

When('aşağıdaki bilgilerle çalışan oluşturuyorum:') do |table|
  row = table.hashes.first
  make_request('POST', '/api/v1/users', {
    user: {
      name: row['name'],
      email: row['email'],
      password: row['password'],
      role: row['role']
    }
  })
end

When('tüm çalışanları listeliyorum') do
  make_request('GET', '/api/v1/users')
end

When('çalışan bilgilerini aşağıdaki gibi güncelliyorum:') do |table|
  row = table.hashes.first
  make_request('PATCH', "/api/v1/users/#{@user.id}", {
    user: {
      name: row['name'],
      email: row['email']
    }
  })
end

When('bu çalışanı siliyorum') do
  make_request('DELETE', "/api/v1/users/#{@user.id}")
end

When('aynı email ile yeni bir çalışan oluşturmaya çalışıyorum:') do |table|
  row = table.hashes.first
  make_request('POST', '/api/v1/users', {
    user: {
      name: row['name'],
      email: row['email'],
      password: row['password'],
      role: row['role']
    }
  })
end

Then('çalışan başarıyla oluşturulmalı') do
  expect(get_response_status).to eq(201)
  response = get_json_response
  expect(response).to have_key('id')
  expect(response).to have_key('name')
  expect(response).to have_key('email')
  @created_user = response
end

Then('çalışan adı "{string}" olmalı') do |name|
  response = get_json_response
  expect(response['name']).to eq(name)
end

Then('çalışan email\'i "{string}" olmalı') do |email|
  response = get_json_response
  expect(response['email']).to eq(email)
end

Then('çalışan rolü "{string}" olmalı') do |role|
  response = get_json_response
  expect(response['role']).to eq(role)
end

Then('{int} çalışan görüntülenmeli') do |count|
  expect(get_response_status).to eq(200)
  response = get_json_response
  expect(response).to be_an(Array)
  expect(response.length).to eq(count)
end

Then('listede "{string}" olmalı') do |name|
  response = get_json_response
  names = response.map { |u| u['name'] }
  expect(names).to include(name)
end

Then('çalışan başarıyla güncellenmeli') do
  expect(get_response_status).to eq(200)
end

Then('çalışan başarıyla silinmeli') do
  expect(get_response_status).to eq(204)
end

Then('çalışan listede görünmemeli') do
  make_request('GET', '/api/v1/users')
  response = get_json_response
  ids = response.map { |u| u['id'] }
  expect(ids).not_to include(@user.id)
end

Then('hata mesajı almalıyım') do
  expect(get_response_status).to be >= 400
end

Then('hata mesajı email\'in zaten kullanıldığını belirtmeli') do
  response = get_json_response
  expect(response).to have_key('errors')
  error_messages = response['errors']
  expect(error_messages.join(' ')).to match(/email|already|taken/i)
end

