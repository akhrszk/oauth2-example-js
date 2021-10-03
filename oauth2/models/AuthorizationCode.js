const { DataTypes } = require('sequelize')

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
      isUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      tableName: 'authorization_codes',
      underscored: true
    }
  )
}
