const { models } = require('../models')
const randomstring = require('randomstring')

class ClientService {
  constructor(models) {
    this.models = models
  }

  findByApp(app) {
    return models.Client.findAll({
      where: { appId: app.id }
    })
  }

  find(user, app, clientId) {
    return models.Client.findOne({
      where: { id: clientId, userId: user.id, appId: app.id }
    })
  }

  async findById(clientId) {
    const client = await models.Client.findByPk(clientId)
    const app = await models.App.findByPk(client.appId, {
      include: [models.Scope, models.RedirectUri]
    })
    return { client, scopes: app.Scopes, redirectUris: app.RedirectUris }
  }

  create(app, user) {
    return models.Client.create({
      name: randomstring.generate(25),
      secret: randomstring.generate(50),
      appId: app.id,
      userId: user.id
    })
  }

  regenerateSecret(client) {
    client.secret = randomstring.generate(50)
    return client.save()
  }

  static newInstance() {
    return new ClientService(models)
  }
}

module.exports = ClientService
