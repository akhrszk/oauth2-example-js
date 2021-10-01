const { Sequelize } = require('sequelize')
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

const modelDefiners = [require('./User'), require('./Status')]

modelDefiners.forEach((definer) => definer(sequelize))

module.exports = sequelize
