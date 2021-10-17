const TsubuyakiService = require('../service/TsubuyakiService')

const refreshAccessTokenIfNeed = () => {
  return async (req, res, next) => {
    const refreshToken = req.session.tsubuyakiRefreshToken
    const expires = req.session.tsubuyakiAccessTokenExpires
    const now = Math.floor(Date.now() / 1000)
    if (refreshToken && now > expires) {
      const data = await TsubuyakiService.sharedInstance.refreshAccessToken(
        refreshToken
      )
      console.log('Refreshed access token', data)
      req.session.tsubuyakiAccessToken = data['access_token']
      req.session.tsubuyakiAccessTokenExpires = Date.now() + data['expires_in']
    }
    next()
  }
}

module.exports = {
  refreshAccessTokenIfNeed
}
