import http from 'http'

describe('API', () => {
  it('should return "Hello, API!" on /api request', () => {
    http.get('http://localhost:3000/api/', response => {
      let data = '';
      response.on('data', _data => (data += _data));
      response.on('end', () => expect(data).toEqual('Hello, API!'));
    });
  })
})
