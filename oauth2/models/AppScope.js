const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'AppScope',
    {
      appId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      scopeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      }
    },
    {
      tableName: 'apps_scopes',
      underscored: true,
      timestamps: false
    }
  )
}
