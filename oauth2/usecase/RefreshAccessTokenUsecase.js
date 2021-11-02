const { models } = require('../models')
const AuthorizationService = require('../service/AuthorizationService')

exports.execute = async (params) => {
  const { clientName, clientSecret, refreshToken: token } = params
  const client = await models.Client.findOne({ where: { name: clientName } })
  if (client && client.secret !== clientSecret) {
    return undefined
  }
  const authorizationService = AuthorizationService.sharedInstance
  const { refreshToken } = await authorizationService.findRefreshToken(
    client,
    token
  )
  if (!refreshToken) {
    return undefined
  }
  const accessToken = await authorizationService.refreshAccessToken(
    refreshToken
  )
  return accessToken
}
