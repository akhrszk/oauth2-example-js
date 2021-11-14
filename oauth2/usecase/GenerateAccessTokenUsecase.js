const ClientService = require('../service/ClientService')
const AuthorizationService = require('../service/AuthorizationService')

exports.execute = async (params) => {
  const { code, clientName, clientSecret, redirectUri } = params
  const clientService = ClientService.sharedInstance
  const authorizationService = AuthorizationService.sharedInstance
  const { client, redirectUris } = await clientService.findByName(clientName)
  const checkClient =
    client &&
    client.secret === clientSecret &&
    redirectUris.map(({ uri }) => uri).includes(redirectUri)
  if (!checkClient) {
    return undefined
  }
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
  return { accessToken, refreshToken }
}
