const { models } = require('../models')

exports.execute = async (user) => {
  return await models.Client.findAll({
    where: { userId: user.id },
    include: [models.RedirectUri]
  })
}
