const { models } = require('../models')
const { generateAccessToken } = require('../common/Functions')

exports.execute = async (params) => {
  const { clientName, clientSecret, refreshToken } = params
  const client = await models.Client.findOne({ where: { name: clientName } })
  if (client && client.secret !== clientSecret) {
    throw new Error('')
  }
  const found = await models.RefreshToken.findOne({
    where: { clientId: client.id, isRevoked: false }
  })
  if (found && found.token !== refreshToken) {
    throw new Error('')
  }
  const { token: accessToken } = await models.AccessToken.create({
    clientId: client.id,
    token: generateAccessToken(),
    userId: found.userId
  })
  return { accessToken }
}
