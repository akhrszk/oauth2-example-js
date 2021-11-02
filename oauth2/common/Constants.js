module.exports = Object.freeze({
  PORT: process.env.PORT ?? 3000,
  SESSION_SECRET: process.env.SESSION_SECRET ?? 'secret',
  DB_DATABASE: process.env.DB_DATABASE ?? 'tsubuyaki',
  DB_USERNAME: process.env.DB_USERNAME ?? 'root',
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST ?? '127.0.0.1',
  ACCESS_TOKEN_EXPIRES_IN: 60 * 60, // access_tokenの期限は60分
  AUTHORIZATION_CODE_EXPIRES_IN: 30 // authorization_codeの期限は30秒
})
