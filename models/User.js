import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import 'babel-polyfill'

const userSchema = mongoose.Schema({
  name: { type: String },
  surname: { type: String },
  dob: { type: String },
  role: { type: String, default: 'player' },
  tasksSolved: { type: Array, default: [] },
  money: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  username: { type: String, unique: true },
  password: { type: String },
  registerDate: { type: String },
  friends: { type: Array, default: [] }
})
userSchema.pre('save', async function () {
  try {
    bcrypt.getRounds(this.password)
  } catch (err) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})
userSchema.method('comparePassword', async function (pass) {
  return await bcrypt.compare(pass, this.password)
})
const User = mongoose.model('User', userSchema)

export default User
