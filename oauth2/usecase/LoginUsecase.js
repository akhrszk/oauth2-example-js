const { models } = require('../models')
const { hashPassword } = require('../common/Functions')

exports.execute = async (params) => {
  const { email, pass } = params
  const user = await models.User.findOne({ where: { email } })
  if (user && user.password === hashPassword(pass)) {
    return user
  }
}
