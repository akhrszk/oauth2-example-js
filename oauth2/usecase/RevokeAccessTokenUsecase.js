const { models } = require('../models')

exports.execute = async (params) => {
  const { accessToken, refreshToken } = params
  accessToken &&
    (await models.AccessToken.update(
      { isRevoked: true },
      { where: { token: accessToken } }
    ))
  refreshToken &&
    (await models.RefreshToken.update(
      { isRevoked: true },
      { where: { token: refreshToken } }
    ))
}
