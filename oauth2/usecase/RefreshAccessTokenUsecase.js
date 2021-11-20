const AuthorizationService = require('../service/AuthorizationService')
const ClientService = require('../service/ClientService')

exports.execute = async (params) => {
  const { refreshToken: token, clientName, clientSecret } = params
  const clientService = ClientService.sharedInstance
  const { client } = await clientService.findByName(clientName)
  const checkedClient = !!client && client.secret === clientSecret
  if (!checkedClient) {
    return undefined
  }
  const authorizationService = AuthorizationService.sharedInstance
  const refreshToken = await authorizationService.findRefreshToken(token)
  if (
    !refreshToken ||
    refreshToken.isRevoked ||
    refreshToken.clientId !== client.id
  ) {
    return undefined
  }
  const { accessToken, scopes } = await authorizationService.refreshAccessToken(
    refreshToken
  )
  return { accessToken, scopes }
}
