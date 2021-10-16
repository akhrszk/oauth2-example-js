module.exports = Object.freeze({
  PORT: process.env.PORT ?? 3000,
  SESSION_SECRET: process.env.SESSION_SECRET ?? 'secret',
  TSUBUYAKI_OAUTH_LOGIN_URL:
    process.env.TSUBUYAKI_OAUTH_LOGIN_URL ?? 'http://localhost:9001/login',
  TSUBUYAKI_OAUTH_TOKEN_URL:
    process.env.TSUBUYAKI_OAUTH_TOKEN_URL ??
    'http://localhost:9001/oauth2/token',
  TSUBUYAKI_API_BASE_URL:
    process.env.TSUBUYAKI_API_BASE_URL ?? 'http://localhost:9001/api',
  TSUBUYAKI_CLIENT_ID: process.env.TSUBUYAKI_CLIENT_ID,
  TSUBUYAKI_CLIENT_SECRET: process.env.TSUBUYAKI_CLIENT_SECRET,
  TSUBUYAKI_REDIRECT_URI: process.env.TSUBUYAKI_REDIRECT_URI
})
