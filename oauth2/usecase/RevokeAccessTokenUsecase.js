const { models } = require('../models')

exports.execute = async (params) => {
  const { accessToken, refreshToken } = params
  accessToken &&
    (await models.AccessToken.update(
      { isRevoked: true },
      { token: accessToken }
    ))
  refreshToken &&
    (await models.RefreshToken.update(
      { isRevoked: true },
      { token: refreshToken }
    ))
}
