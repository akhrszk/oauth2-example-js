const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'RedirectUri',
    {
      appId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      uri: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      tableName: 'redirect_uris',
      underscored: true
    }
  )
}
