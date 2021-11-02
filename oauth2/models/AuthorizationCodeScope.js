const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'AuthorizationCodeScope',
    {
      authorizationCodeId: {
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
      tableName: 'authorization_codes_scopes',
      underscored: true,
      timestamps: false
    }
  )
}
