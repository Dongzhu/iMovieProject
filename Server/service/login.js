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

export async function checkRegister(username, email) {
  let register = false, message = ''

  const User = mongoose.model('User')
  const user = await User.findOne({ username: username }).exec()
  const user2 = await User.findOne({ email: email }).exec()

  // console.log('user: ', user);
  if (user) {
    register = true, message = '当前用户名已被注册'
  } else if (user2) {
    register = true, message = '当前邮箱已被注册'
  } else {
    register = false, message = ''
  }

  return { register, message }
}
