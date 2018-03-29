import axios from 'axios'
import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt'

describe('API', () => {
  it('should return "Hello, API!" on /api request', () => {
    expect.assertions(1)
    return axios.get('http://localhost:3000/api/')
    .then(response => {
      expect(response.data).toEqual('Hello, API!')
    })
  })

  it('should return valid JWT token on /api/auth/login POST request', () => {
    expect.assertions(2)
    return axios.post('http://localhost:3000/api/auth/login', {})
    .then(response => {
      expect(response.data.token).toBeDefined()
      expect(jwt.verify(response.data.token, jwtConfig.secret)).toBeDefined()
    })
  })
})
