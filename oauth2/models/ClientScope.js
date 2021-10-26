const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'ClientScope',
    {
      clientId: {
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
      tableName: 'client_scope',
      underscored: true,
      timestamps: false
    }
  )
}
