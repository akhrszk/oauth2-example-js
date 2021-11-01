module.exports = {
  applyExtraSetup: (sequelize) => {
    const { App, RedirectUri, Scope, AppScope } = sequelize.models
    App.hasMany(RedirectUri, { foreignKey: 'appId' })
    App.belongsToMany(Scope, { through: AppScope })
  }
}
