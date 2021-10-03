const { DataTypes } = require('sequelize')

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
      isRevoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      tableName: 'access_tokens',
      underscored: true
    }
  )
}
