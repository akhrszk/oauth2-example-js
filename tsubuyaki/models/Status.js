const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Status',
    {
      body: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'statuses',
      underscored: true
    }
  )
}
