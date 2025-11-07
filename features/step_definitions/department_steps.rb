Given('yeni bir departman oluşturmak istiyorum') do
  # Intent belirtir
end

When('aşağıdaki bilgilerle departman oluşturuyorum:') do |table|
  row = table.hashes.first
  make_request('POST', '/api/v1/departments', {
    department: {
      name: row['name'],
      description: row['description']
    }
  })
end

When('tüm departmanları listeliyorum') do
  make_request('GET', '/api/v1/departments')
end

When('departman bilgilerini aşağıdaki gibi güncelliyorum:') do |table|
  row = table.hashes.first
  make_request('PATCH', "/api/v1/departments/#{@department.id}", {
    department: {
      name: row['name'],
      description: row['description']
    }
  })
end

When('bu departmanı siliyorum') do
  make_request('DELETE', "/api/v1/departments/#{@department.id}")
end

Then('departman başarıyla oluşturulmalı') do
  expect(get_response_status).to eq(201)
  response = get_json_response
  expect(response).to have_key('id')
  expect(response).to have_key('name')
  @created_department = response
end

Then('departman adı "{string}" olmalı') do |name|
  response = get_json_response
  expect(response['name']).to eq(name)
end

Then('departman açıklaması "{string}" olmalı') do |description|
  response = get_json_response
  expect(response['description']).to eq(description)
end

Then('{int} departman görüntülenmeli') do |count|
  expect(get_response_status).to eq(200)
  response = get_json_response
  expect(response).to be_an(Array)
  expect(response.length).to eq(count)
end

Then('departman başarıyla güncellenmeli') do
  expect(get_response_status).to eq(200)
end

Then('departman başarıyla silinmeli') do
  expect(get_response_status).to eq(204)
end

Then('departman listede görünmemeli') do
  make_request('GET', '/api/v1/departments')
  response = get_json_response
  ids = response.map { |d| d['id'] }
  expect(ids).not_to include(@department.id)
end

