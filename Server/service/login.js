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
