const { models } = require('../models')
const {
  generateAccessToken,
  generateRefreshToken
} = require('../common/Functions')

exports.execute = async (params) => {
  const { code, clientName, clientSecret, redirectUri } = params
  const client = await models.Client.findOne({
    where: { name: clientName },
    include: [models.RedirectUri]
  })
  const checkClient =
    client &&
    client.secret === clientSecret &&
    client.RedirectUris.map(({ uri }) => uri).includes(redirectUri)
  if (!checkClient) {
    return undefined
  }
  const found = await models.AuthorizationCode.findOne({
    where: { clientId: client.id, code }
  })
  const checkCode = found && !found.isUsed
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
