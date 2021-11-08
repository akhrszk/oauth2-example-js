const axios = require('axios')
const querystring = require('querystring')
const { models } = require('../models')

const authorization = (options) => {
  const requiredScopes = options?.required
  return async (req, res, next) => {
    const { token } = ((authorization) => {
      const tuple = authorization?.split(' ') ?? []
      const kv = new Map([tuple])
      return { token: kv.get('Bearer') }
    })(req.headers['authorization'])
    if (!!requiredScopes && !token) {
      res.status(401)
      res.send('Unauthorized')
      return
    }
    if (!requiredScopes && !token) {
      next()
      return
    }
    const { active, sub, scope } = await tokenIntrospection(token)
    if (!active && !!requiredScopes) {
      res.status(403)
      res.send('Forbidden')
      return
    }
    if (!active) {
      next()
      return
    }
    const user = await models.User.findByPk(sub)
    if (!user && !!requiredScopes) {
      res.status(403)
      res.send('Forbidden')
      return
    }
    if (!user) {
      next()
      return
    }
    const having = scope.split(' ')
    if (!requiredScopes.every((scope) => having.includes(scope))) {
      res.status(403)
      res.send('Forbidden')
      return
    }
    req.authorization = {
      user,
      scope: having
    }
    next()
  }
}

const tokenIntrospection = async (token) => {
  const res = await axios.post(
    'http://oauth2:3000/introspection',
    querystring.stringify({ token })
  )
  return res.data
}

module.exports = {
  authorization
}
