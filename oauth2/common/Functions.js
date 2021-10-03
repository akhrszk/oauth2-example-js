const randomstring = require('randomstring')
const { createHash } = require('crypto')

exports.hashPassword = (rawPassword) => {
  const hash = createHash('sha256')
  hash.update(rawPassword, 'utf8')
  return hash.digest('hex')
}

exports.generateAccessToken = () => {
  return randomstring.generate(50)
}

exports.generateRefreshToken = () => {
  return randomstring.generate(25)
}

exports.generateAuthorizationCode = () => {
  return randomstring.generate(50)
}
