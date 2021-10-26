const ClientService = require('../service/ClientService')

exports.execute = async (params) => {
  const { clientName, redirectUris, scopes } = params
  const clientService = ClientService.newInstance()
  const client = await clientService.findByName(clientName)
  if (!client) {
    return undefined
  }
  await Promise.all([
    clientService.setScopes(client, scopes),
    clientService.setRedirectUris(client, redirectUris)
  ])
  return await clientService.findByName(clientName)
}
