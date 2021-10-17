const { DataTypes } = require('sequelize')
const { ACCESS_TOKEN_EXPIRES_IN } = require('../common/Constants')

module.exports = (sequelize) => {
  sequelize.define(
    'AccessToken',
    {
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isRevoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      exp: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.iat + ACCESS_TOKEN_EXPIRES_IN
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
      tableName: 'access_tokens',
      underscored: true
    }
  )
}
