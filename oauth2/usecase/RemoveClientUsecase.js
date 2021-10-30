const { models } = require('../models')

exports.execute = async (params) => {
  const { clientName } = params
  await models.Client.destroy({ where: { name: clientName } })
}