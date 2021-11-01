const { models } = require('../models')

class AppService {
  constructor(models) {
    this.models = models
  }

  find(user, appId) {
    return models.App.findOne({
      where: { id: appId, userId: user.id },
      include: [models.RedirectUri, models.Scope]
    })
  }

  findById(id) {
    return models.App.findByPk(id, {
      include: [models.RedirectUri, models.Scope]
    })
  }

  findByUser(user) {
    return models.App.findAll({
      where: { userId: user.id },
      include: [models.RedirectUri, models.Scope]
    })
  }

  create(name, user) {
    return models.App.create({
      name,
      userId: user.id
    })
  }

  remove(app) {
    return app.destroy()
  }

  async setScopes(app, scopes) {
    const found = await models.Scope.findAll({ where: { scope: scopes } })
    const unsetScopes = app.Scopes.filter(
      ({ scope }) => !scopes.includes(scope)
    )
    const setScopes = (() => {
      const arr = app.Scopes.map(({ scope }) => scope)
      return found.filter(({ scope }) => !arr.includes(scope))
    })()
    await Promise.all([
      models.AppScope.destroy({
        where: { appId: app.id, scopeId: unsetScopes.map(({ id }) => id) }
      }),
      models.AppScope.bulkCreate(
        setScopes.map(({ id }) => ({ appId: app.id, scopeId: id }))
      )
    ])
  }

  async setRedirectUris(app, redirectUris) {
    const exists = app.RedirectUris.map(({ uri }) => uri)
    const del = exists.filter((v) => !redirectUris.includes(v))
    const add = redirectUris.filter((v) => !exists.includes(v))
    await Promise.all([
      models.RedirectUri.destroy({ where: { appId: app.id, uri: del } }),
      models.RedirectUri.bulkCreate(add.map((v) => ({ appId: app.id, uri: v })))
    ])
  }

  static newInstance() {
    return new AppService(models)
  }
}

module.exports = AppService
