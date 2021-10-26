module.exports = {
  applyExtraSetup: (sequelize) => {
    const { Client, RedirectUri, Scope, ClientScope } = sequelize.models
    Client.hasMany(RedirectUri, { foreignKey: 'clientId' })
    Client.belongsToMany(Scope, { through: ClientScope })
  }
}
