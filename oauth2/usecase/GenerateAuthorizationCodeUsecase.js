const { models } = require('../models')
const ClientService = require('../service/ClientService')
const { generateAuthorizationCode } = require('../common/Functions')

exports.execute = async (params) => {
  const { clientName, user, redirectUri } = params
  const clientService = ClientService.sharedInstance
  const { client, redirectUris } = await clientService.findByName(clientName)
  if (!client) {
    return undefined
  }
  if (!redirectUris.map(({ uri }) => uri).includes(redirectUri)) {
    return undefined
  }
  const { code } = await models.AuthorizationCode.create({
    clientId: client.id,
    code: generateAuthorizationCode(),
    userId: user.id
  })
  return code
}
