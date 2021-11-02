module.exports = {
  applyExtraSetup: (sequelize) => {
    const {
      App,
      RedirectUri,
      Scope,
      AppScope,
      AuthorizationCode,
      AuthorizationCodeScope
    } = sequelize.models
    App.hasMany(RedirectUri, { foreignKey: 'appId' })
    App.belongsToMany(Scope, { through: AppScope })
    AuthorizationCode.belongsToMany(Scope, { through: AuthorizationCodeScope })
  }
}
