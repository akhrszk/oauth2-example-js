const { models } = require('../models')
const { ACCESS_TOKEN_EXPIRES_IN } = require('../common/Constants')
const ClientService = require('../service/ClientService')

exports.execute = async (params) => {
  const { token } = params
  const found = await models.AccessToken.findOne({
    where: { token }
  })
  const clientService = ClientService.newInstance()
  const { scopes } = await clientService.findById(found.clientId)
  return (
    found &&
    !isExpired(token) && {
      scope: scopes.map(({ scope }) => scope).join(' '),
      sub: `${found.userId}`, // ユーザーの識別子
      aud: 'http://tsubuyaki.test/',
      iss: 'http://nyan.test/',
      exp: found.exp, // 有効期限
      iat: found.iat // 発行された時刻
    }
  )
}

const isExpired = (token) => {
  const now = Date.now()
  const tokenCreatedAt = new Date(token.createdAt).getTime()
  return tokenCreatedAt + ACCESS_TOKEN_EXPIRES_IN > now
}
