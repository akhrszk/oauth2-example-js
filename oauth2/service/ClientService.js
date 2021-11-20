const { models } = require('../models')
const randomstring = require('randomstring')

class ClientService {
  constructor(models) {
    this.models = models
  }

  async findByApp(app) {
    return await models.Client.findAll({
      where: { appId: app.id }
    })
  }

  async find(app, clientId) {
    const client = await models.Client.findOne({
      where: { id: clientId, appId: app.id }
    })
    if (!client) {
      return {}
    }
    const { scopes, redirectUris } = await this.getScopesAndRedirectUris(client)
    return { client, scopes, redirectUris }
  }

  async findByName(name) {
    const client = await models.Client.findOne({ where: { name } })
    if (!client) {
      return {}
    }
    const { scopes, redirectUris } = await this.getScopesAndRedirectUris(client)
    return { client, scopes, redirectUris }
  }

  async getScopesAndRedirectUris(client) {
    const app = await models.App.findByPk(client.appId, {
      include: [models.Scope, models.RedirectUri]
    })
    if (!app) {
      return {}
    }
    return { scopes: app.Scopes, redirectUris: app.RedirectUris }
  }

  create(app) {
    return models.Client.create({
      name: randomstring.generate(25),
      secret: randomstring.generate(50),
      appId: app.id
    })
  }

  regenerateSecret(client) {
    client.secret = randomstring.generate(50)
    return client.save()
  }

  static get sharedInstance() {
    if (!this._sharedInstance) {
      this._sharedInstance = new ClientService(models)
    }
    return this._sharedInstance
  }
}

module.exports = ClientService
