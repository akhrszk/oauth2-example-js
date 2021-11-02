const { models } = require('../models')
const {
  generateAccessToken,
  generateRefreshToken
} = require('../common/Functions')
const ClientService = require('../service/ClientService')

exports.execute = async (params) => {
  const { code, clientName, clientSecret, redirectUri } = params
  const clientService = ClientService.sharedInstance
  const { client, redirectUris } = await clientService.findByName(clientName)
  const checkClient =
    client &&
    client.secret === clientSecret &&
    redirectUris.map(({ uri }) => uri).includes(redirectUri)
  if (!checkClient) {
    return undefined
  }
  const found = await models.AuthorizationCode.findOne({
    where: { clientId: client.id, code }
  })
  const checkCode = found && !found.isUsed && !found.isExpired
  if (!checkCode) {
    return undefined
  }
  const [{ token: accessToken }, { token: refreshToken }] = await Promise.all([
    models.AccessToken.create({
      clientId: client.id,
      token: generateAccessToken(),
      userId: found.userId
    }),
    models.RefreshToken.create({
      clientId: client.id,
      token: generateRefreshToken(),
      userId: found.userId
    })
  ])
  found.isUsed = true
  await found.save()
  return { accessToken, refreshToken }
}
