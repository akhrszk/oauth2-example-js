const AuthorizationService = require('../service/AuthorizationService')

exports.execute = async (params) => {
  const { token } = params
  const authorizationService = AuthorizationService.sharedInstance
  const { accessToken, scopes } = await authorizationService.findAccessToken(
    token
  )
  if (!accessToken) {
    return undefined
  }
  return {
    scope: scopes.map(({ scope }) => scope).join(' '),
    sub: `${accessToken.userId}`, // ユーザーの識別子
    aud: 'http://tsubuyaki.test/',
    iss: 'http://nyan.test/',
    exp: accessToken.exp, // 有効期限
    iat: accessToken.iat // 発行された時刻
  }
}
