const { createHash } = require('crypto')

const hashPassword = (rawPassword) => {
  const hash = createHash('sha256')
  hash.update(rawPassword, 'utf8')
  return hash.digest('hex')
}

module.exports = {
  hashPassword
}
