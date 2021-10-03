const { models } = require('../models')

exports.execute = async (params) => {
  const { token } = params
  const found = await models.AccessToken.findOne({
    token
  })
  return (
    found && {
      scope: 'read write',
      sub: 'xxx', // ユーザーの識別子
      aud: 'http://tsubuyaki.test/',
      iss: 'http://nyan.test/',
      exp: 123456789, // 有効期限
      iat: 123456789 // 発行された時刻
    }
  )
}
