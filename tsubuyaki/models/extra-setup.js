module.exports = {
  applyExtraSetup: (sequelize) => {
    const { User, Status } = sequelize.models
    Status.belongsTo(User, { foreignKey: 'userId' })
  }
}