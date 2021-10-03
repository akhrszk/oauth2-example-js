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
      label: {
        type: DataTypes.STRING(64),
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
