module.exports = {
  ...require('./AuthenticationMiddleware'),
  ...require('./AuthorizationMiddleware')
}
