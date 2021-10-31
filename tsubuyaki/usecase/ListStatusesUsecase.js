const { models } = require('../models')

exports.execute = () => {
  return models.Status.findAll({
    include: [models.User],
    order: [['id', 'DESC']],
    limit: 15
  })
}