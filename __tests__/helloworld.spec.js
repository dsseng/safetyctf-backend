import http from 'http'

describe('Hello, World!', () => {
  it('should return "Hello, World!" on / request', () => {
    http.get('http://localhost:3000/', response => {
      let data = '';
      response.on('data', _data => (data += _data));
      response.on('end', () => expect(data).toEqual('Hello, World!'));
    });
  })
})
