const AuthorizationService = require('../service/AuthorizationService')

exports.execute = async (params) => {
  const { refreshToken: token } = params
  const authorizationService = AuthorizationService.sharedInstance
  const { refreshToken } = await authorizationService.findRefreshToken(
    token
  )
  if (!refreshToken || refreshToken.isRevoked) {
    return undefined
  }
  return await authorizationService.refreshAccessToken(refreshToken)
}
