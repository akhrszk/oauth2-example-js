const TsubuyakiService = require('../service/TsubuyakiService')

const refreshAccessTokenIfNeed = () => {
  return async (req, res, next) => {
    const refreshToken = req.session.tsubuyakiRefreshToken
    const expires = req.session.tsubuyakiAccessTokenExpires
    const data = await TsubuyakiService.sharedInstance.refreshAccessTokenIfNeed(
      refreshToken,
      expires
    )
    if (data) {
      console.log('refreshed access_token', data)
      req.session.tsubuyakiAccessToken = data['access_token']
      req.session.tsubuyakiAccessTokenExpires =
        Date.now() + data['expires_in'] * 1000
    }
    next()
  }
}

module.exports = {
  refreshAccessTokenIfNeed
}
