const settings = {
  PORT: process.env.PORT ?? 3000,
  SESSION_SECRET: process.env.SESSION_SECRET ?? 'secret',
  TSUBUYAKI_OAUTH_LOGIN_URL:
    process.env.TSUBUYAKI_OAUTH_LOGIN_URL ??
    'http://localhost:9001/oauth2/authorize',
  TSUBUYAKI_OAUTH_BASE_URL:
    process.env.TSUBUYAKI_OAUTH_BASE_URL ?? 'http://oauth2:3000',
  TSUBUYAKI_API_BASE_URL:
    process.env.TSUBUYAKI_API_BASE_URL ?? 'http://tsubuyaki:3000/api',
  TSUBUYAKI_CLIENT_ID: process.env.TSUBUYAKI_CLIENT_ID,
  TSUBUYAKI_CLIENT_SECRET: process.env.TSUBUYAKI_CLIENT_SECRET,
  TSUBUYAKI_REDIRECT_URI: process.env.TSUBUYAKI_REDIRECT_URI
}

module.exports = Object.freeze({
  ...settings,
  IS_SET_CLIENT_CREDENTIALS:
    !!settings.TSUBUYAKI_CLIENT_ID &&
    !!settings.TSUBUYAKI_CLIENT_SECRET &&
    !!settings.TSUBUYAKI_REDIRECT_URI
})
