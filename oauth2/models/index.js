const { Sequelize } = require('sequelize')
const { applyExtraSetup } = require('./extra-setup')
const {
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST
} = require('../common/Constants')

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  dialect: 'mysql',
  host: DB_HOST
})

const modelDefiners = [
  require('./User'),
  require('./App'),
  require('./Client'),
  require('./AuthorizationCode'),
  require('./AccessToken'),
  require('./RefreshToken'),
  require('./RedirectUri'),
  require('./Scope'),
  require('./AppScope'),
  require('./AuthorizationCodeScope')
]

modelDefiners.forEach((definer) => definer(sequelize))

applyExtraSetup(sequelize)

module.exports = sequelize
