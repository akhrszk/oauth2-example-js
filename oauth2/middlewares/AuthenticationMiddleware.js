const { models } = require('../models')

const authentication = (options) => {
  const required = options?.required ?? false
  return async (req, res, next) => {
    const { loggedInUserId } = req.session
    if (!loggedInUserId && required) {
      res.redirect('/login')
      return
    }
    if (!loggedInUserId && !required) {
      req.authentication = {}
      next()
      return
    }
    const user = await models.User.findByPk(loggedInUserId)
    req.authentication = { user }
    next()
  }
}

module.exports = {
  authentication
}
