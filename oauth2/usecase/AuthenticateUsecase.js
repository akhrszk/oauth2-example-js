const { models } = require('../models')

exports.execute = async (params) => {
  const { userId } = params
  if (userId) {
    return await models.User.findByPk(userId)
  }
}
