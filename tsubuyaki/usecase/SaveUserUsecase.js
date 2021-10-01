const { models } = require('../models')

exports.execute = async (params) => {
  const { name, email, pass } = params
  return await models.User.create({ name, email, password: pass })
}
