require 'net/http'
require 'json'
require 'uri'
require 'rspec/expectations'

BASE_URL = 'http://localhost:3000'

def make_request(method, path, body = nil, headers = {})
  uri = URI("#{BASE_URL}#{path}")
  http = Net::HTTP.new(uri.host, uri.port)
  
  request = case method.upcase
            when 'GET'
              Net::HTTP::Get.new(uri)
            when 'POST'
              Net::HTTP::Post.new(uri)
            when 'PUT', 'PATCH'
              Net::HTTP::Patch.new(uri)
            when 'DELETE'
              Net::HTTP::Delete.new(uri)
            end
  
  headers.each { |key, value| request[key] = value }
  request['Content-Type'] = 'application/json' unless headers['Content-Type']
  
  if body
    request.body = body.to_json unless body.is_a?(String)
  end
  
  response = http.request(request)
  @last_response = response
  @last_response_body = JSON.parse(response.body) rescue response.body
  
  response
end

def get_json_response
  @last_response_body
end

def get_response_status
  @last_response&.code&.to_i
end

