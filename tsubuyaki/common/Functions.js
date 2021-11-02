const { createHash } = require('crypto')

const hashPassword = (rawPassword) => {
  const hash = createHash('sha256')
  hash.update(rawPassword, 'utf8')
  return hash.digest('hex')
}

const toSeconds = (date) => {
  return Math.floor(date.getTime() / 1000)
}

module.exports = {
  hashPassword,
  toSeconds
}
