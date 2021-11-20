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
    sub: `${accessToken.userId}`, // ユーザーの識別子
    iss: 'http://oauth2.nyan.test/', // tokenの発行者
    // TODO 決め打ちではなくDBから取得する
    aud: 'http://tsubuyaki.test/', // tokenの受け手
    scope: scopes
      .sort((a, b) => a - b)
      .map(({ scope }) => scope)
      .join(' '),
    exp: accessToken.exp, // 有効期限
    iat: accessToken.iat // 発行された時刻
  }
}
