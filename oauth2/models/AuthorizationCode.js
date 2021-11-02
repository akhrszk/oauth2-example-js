const { DataTypes } = require('sequelize')
const { AUTHORIZATION_CODE_EXPIRES_IN } = require('../common/Constants')

module.exports = (sequelize) => {
  sequelize.define(
    'AuthorizationCode',
    {
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isExpired: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.exp * 1000 < Date.now()
        },
        set(value) {
          throw new Error('Do not try to set the `exp` value!')
        }
      },
      exp: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.iat + AUTHORIZATION_CODE_EXPIRES_IN
        },
        set(value) {
          throw new Error('Do not try to set the `exp` value!')
        }
      },
      iat: {
        type: DataTypes.VIRTUAL,
        get() {
          const createdAt = new Date(this.getDataValue('createdAt')).getTime()
          return Math.floor(createdAt / 1000)
        },
        set(value) {
          throw new Error('Do not try to set the `iat` value!')
        }
      }
    },
    {
      tableName: 'authorization_codes',
      underscored: true
    }
  )
}
