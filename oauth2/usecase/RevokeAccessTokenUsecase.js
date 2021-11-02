const AuthorizationService = require('../service/AuthorizationService')

exports.execute = async (params) => {
  const { accessToken, refreshToken } = params
  const authorizationService = AuthorizationService.sharedInstance
  accessToken && (await authorizationService.revokeAccessToken(accessToken))
  refreshToken && (await authorizationService.revokeRefreshToken(refreshToken))
}
