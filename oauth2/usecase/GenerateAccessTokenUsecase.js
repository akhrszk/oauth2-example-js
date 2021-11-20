const AuthorizationService = require('../service/AuthorizationService')
const ClientService = require('../service/ClientService')

exports.execute = async (params) => {
  const { code, clientName, clientSecret, redirectUri } = params
  const clientService = ClientService.sharedInstance
  const { client, redirectUris } = await clientService.findByName(clientName)
  const checkedClient =
    client &&
    client.secret === clientSecret &&
    redirectUris.map(({ uri }) => uri).includes(redirectUri)
  if (!checkedClient) {
    return undefined
  }
  const authorizationService = AuthorizationService.sharedInstance
  const authorizationCode = await authorizationService.findAuthorizationCode(
    client,
    code
  )
  if (!authorizationCode) {
    return undefined
  }
  const { accessToken, refreshToken } =
    await authorizationService.createAccessToken(client, authorizationCode)
  await authorizationService.useAuthorizationCode(authorizationCode)
  return { accessToken, refreshToken, scopes: authorizationCode.Scopes }
}
