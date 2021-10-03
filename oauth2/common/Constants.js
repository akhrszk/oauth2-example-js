module.exports = Object.freeze({
  PORT: process.env.PORT ?? 3000,
  SESSION_SECRET: process.env.SESSION_SECRET ?? 'secret',
  DB_DATABASE: process.env.DB_DATABASE ?? 'tsubuyaki',
  DB_USERNAME: process.env.DB_USERNAME ?? 'root',
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST ?? '127.0.0.1'
})
