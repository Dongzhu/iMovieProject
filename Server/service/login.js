import mongoose from 'mongoose'

export async function checkPassword(username, password) {
  let match = false

  const User = mongoose.model('User')
  const user = await User.findOne({ username: username }).exec()

  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return { match, user }
}

export async function checkRegister(username) {
  let register = false

  const User = mongoose.model('User')
  const user = await User.findOne({ username: username }).exec()

  // console.log('user: ', user);
  if (user) { register = true }

  return register
}
