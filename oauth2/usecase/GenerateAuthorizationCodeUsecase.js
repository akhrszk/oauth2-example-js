const ClientService = require('../service/ClientService')
const AuthorizationService = require('../service/AuthorizationService')

exports.execute = async (params) => {
  const { clientName, user, redirectUri } = params
  const clientService = ClientService.sharedInstance
  const authorizationService = AuthorizationService.sharedInstance
  const { client, scopes, redirectUris } = await clientService.findByName(
    clientName
  )
  if (!client) {
    return undefined
  }
  if (!redirectUris.map(({ uri }) => uri).includes(redirectUri)) {
    return undefined
  }
  const { code } = await authorizationService.createAuthorizationCode(
    client,
    scopes,
    user
  )
  return code
}
