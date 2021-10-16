const { models } = require('../models')
const { generateAuthorizationCode } = require('../common/Functions')

exports.execute = async (params) => {
  const { clientName, user, redirectUri } = params
  const client = await models.Client.findOne({
    where: { name: clientName },
    include: [models.RedirectUri]
  })
  if (!client) {
    return undefined
  }
  if (!client.RedirectUris.map(({ uri }) => uri).includes(redirectUri)) {
    return undefined
  }
  const { code } = await models.AuthorizationCode.create({
    clientId: client.id,
    code: generateAuthorizationCode(),
    userId: user.id
  })
  return code
}
