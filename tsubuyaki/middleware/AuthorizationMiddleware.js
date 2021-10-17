const axios = require('axios')
const querystring = require('querystring')
const { models } = require('../models')

const tokenIntrospection = async (token) => {
  const res = await axios.post(
    'http://oauth2:3000/introspection',
    querystring.stringify({ token })
  )
  return res.data
}

const authorization = (options) => {
  const required = options?.required ?? false
  return async (req, res, next) => {
    const { token } = ((authorization) => {
      const tuple = authorization?.split(' ') ?? []
      const kv = new Map([tuple])
      return { token: kv.get('Bearer') }
    })(req.headers['authorization'])
    if (required && !token) {
      res.status(401)
      res.send('Unauthorized')
      return
    }
    if (!required && !token) {
      next()
      return
    }
    const { active, sub, scope } = await tokenIntrospection(token)
    if (!active && required) {
      res.status(403)
      res.send('Forbidden')
      return
    }
    if (!active) {
      next()
      return
    }
    const user = await models.User.findByPk(sub)
    if (!user && required) {
      res.status(403)
      res.send('Forbidden')
      return
    }
    if (!user) {
      next()
      return
    }
    req.authorization = {
      user,
      scope: scope.split(' ')
    }
    next()
  }
}

module.exports = {
  authorization
}
