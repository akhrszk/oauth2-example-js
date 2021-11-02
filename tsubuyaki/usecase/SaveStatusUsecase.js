const { models } = require('../models')

exports.execute = async (params) => {
  const { user, status } = params
  status.userId = user.id
  if (!status.body) {
    throw new Error('Not allowed empty')
  }
  const created = await models.Status.create(status)
  created.User = user
  return created
}
