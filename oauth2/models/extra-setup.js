module.exports = {
  applyExtraSetup: (sequelize) => {
    const {
      Client,
      RedirectUri
    } = sequelize.models
    Client.hasMany(RedirectUri, { foreignKey: 'clientId' })
  }
}
