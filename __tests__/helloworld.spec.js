import axios from 'axios'

describe('Hello, World!', () => {
  it('should return "Hello, World!" on / request', () => {
    axios.get('http://localhost:3000/')
    .then(response => {
      expect(response.data).toEqual('Hello, World!')
    });
  })
})
