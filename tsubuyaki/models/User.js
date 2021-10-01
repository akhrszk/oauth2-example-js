const { DataTypes } = require('sequelize')
const { hashPassword } = require('../common/Functions')

module.exports = (sequelize) => {
  sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'hashed_password',
        set(value) {
          this.setDataValue('password', hashPassword(value))
        }
      }
    },
    {
      tableName: 'users',
      underscored: true
    }
  )
}
