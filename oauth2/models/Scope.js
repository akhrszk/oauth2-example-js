const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Scope',
    {
      scope: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      tableName: 'scopes',
      underscored: true
    }
  )
}
