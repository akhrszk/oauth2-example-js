const randomstring = require('randomstring')
const { models } = require('../models')

exports.execute = async (params) => {
  const { label, user } = params
  return await models.Client.create({
    name: randomstring.generate(25),
    secret: randomstring.generate(50),
    userId: user.id,
    label
  })
}
