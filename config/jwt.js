import dotenv from 'dotenv'
import debug from 'debug'

dotenv.config()

export default {
  secret: process.env.JWT_SECRET,
  options: {
    expiresIn: '1h'
  }
}
