const axios = require('axios')
const querystring = require('querystring')
const {
  TSUBUYAKI_OAUTH_LOGIN_URL,
  TSUBUYAKI_OAUTH_BASE_URL,
  TSUBUYAKI_API_BASE_URL,
  TSUBUYAKI_CLIENT_ID,
  TSUBUYAKI_REDIRECT_URI,
  TSUBUYAKI_CLIENT_SECRET
} = require('../common/Constants')

class TsubuyakiService {
  constructor() {}

  get oauthLoginUrl() {
    const query = querystring.stringify({
      client_id: TSUBUYAKI_CLIENT_ID,
      redirect_uri: TSUBUYAKI_REDIRECT_URI,
      response_type: 'code',
      scope: 'read write'
    })
    return `${TSUBUYAKI_OAUTH_LOGIN_URL}?${query}`
  }

  async getAccessToken(code) {
    const res = await axios.post(
      `${TSUBUYAKI_OAUTH_BASE_URL}/oauth2/token`,
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: TSUBUYAKI_CLIENT_ID,
        client_secret: TSUBUYAKI_CLIENT_SECRET,
        redirect_uri: TSUBUYAKI_REDIRECT_URI
      })
    )
    return res.data
  }

  async refreshAccessTokenIfNeed(refreshToken, expires) {
    if (Date.now() > expires) {
      return await this.refreshAccessToken(refreshToken)
    }
  }

  async refreshAccessToken(refreshToken) {
    const res = await axios.post(
      `${TSUBUYAKI_OAUTH_BASE_URL}/oauth2/token`,
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: TSUBUYAKI_CLIENT_ID,
        client_secret: TSUBUYAKI_CLIENT_SECRET
      })
    )
    return res.data
  }

  async revokeTokens(accessToken, refreshToken) {
    await axios.post(
      `${TSUBUYAKI_OAUTH_BASE_URL}/revoke`,
      querystring.stringify({
        access_token: accessToken,
        refresh_token: refreshToken
      })
    )
  }

  async getMe(accessToken) {
    try {
      const res = await axios.get(`${TSUBUYAKI_API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      return res.data
    } catch (err) {
      console.log(err)
      return undefined
    }
  }

  async send(message, accessToken) {
    try {
      const res = await axios.post(
        `${TSUBUYAKI_API_BASE_URL}/status`,
        querystring.stringify({ body: message }),
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      return res.data
    } catch (err) {
      console.log(err)
      return undefined
    }
  }

  static get sharedInstance() {
    if (!this._sharedInstance) {
      this._sharedInstance = new TsubuyakiService()
    }
    return this._sharedInstance
  }
}

module.exports = TsubuyakiService
