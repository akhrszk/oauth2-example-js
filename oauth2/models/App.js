const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'App',
    {
      name: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'apps',
      underscored: true,
      paranoid: true
    }
  )
}
