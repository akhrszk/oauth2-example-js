const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Client',
    {
      name: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      secret: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      appId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'clients',
      underscored: true,
      paranoid: true
    }
  )
}
