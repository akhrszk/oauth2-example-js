const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'RefreshToken',
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
      }
    },
    {
      tableName: 'refresh_tokens',
      underscored: true
    }
  )
}
