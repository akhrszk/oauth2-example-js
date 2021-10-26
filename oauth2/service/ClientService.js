const { models } = require('../models')

class ClientService {
  constructor(models) {
    this.models = models
  }

  findByName(name) {
    return models.Client.findOne({
      where: { name },
      include: [models.RedirectUri, models.Scope]
    })
  }

  findByUser(user) {
    return models.Client.findAll({
      where: { userId: user.id },
      include: [models.RedirectUri, models.Scope]
    })
  }

  async setScopes(client, scopes) {
    const found = await models.Scope.findAll({ where: { scope: scopes } })
    const unsetScopes = client.Scopes.filter(
      ({ scope }) => !scopes.includes(scope)
    )
    const setScopes = (() => {
      const arr = client.Scopes.map(({ scope }) => scope)
      return found.filter(({ scope }) => !arr.includes(scope))
    })()
    await Promise.all([
      models.ClientScope.destroy({
        where: { clientId: client.id, scopeId: unsetScopes.map(({ id }) => id) }
      }),
      models.ClientScope.bulkCreate(
        setScopes.map(({ id }) => ({ clientId: client.id, scopeId: id }))
      )
    ])
  }

  async setRedirectUris(client, redirectUris) {
    const arr = client.RedirectUris.map(({ uri }) => uri)
    const del = arr.filter((v) => !redirectUris.includes(v))
    const add = redirectUris.filter((v) => !arr.includes(v))
    await Promise.all([
      models.RedirectUri.destroy({ where: { clientId: client.id, uri: del } }),
      models.RedirectUri.bulkCreate(
        add.map((v) => ({ clientId: client.id, uri: v }))
      )
    ])
  }

  static newInstance() {
    return new ClientService(models)
  }
}

module.exports = ClientService
