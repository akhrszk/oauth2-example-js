const express = require('express')
const { authentication } = require('../middlewares')
const AppService = require('../service/AppService')
const ClientService = require('../service/ClientService')
const UpdateAppUsecase = require('../usecase/UpdateAppUsecase')

const router = express.Router()

router.get('/create', async (req, res) => {
  res.render('apps/create')
})

router.get(
  '/:app(\\d+)',
  authentication({ required: true }),
  async (req, res) => {
    const { user } = req.authentication
    const appId = req.params['app']
    const appService = AppService.sharedInstance
    const clientService = ClientService.sharedInstance
    const app = await appService.find(user, appId)
    if (!app) {
      res.status(404)
      res.send('Not Found')
      return
    }
    const clients = await clientService.findByApp(app)
    res.render('apps/details', {
      authenticatedUser: user,
      app,
      clients,
      hasScope: (scope) => !!app.Scopes.find((v) => v.scope === scope)
    })
  }
)

router.post('/create', authentication(), async (req, res) => {
  const { name } = req.body
  const { user } = req.authentication
  const appService = AppService.sharedInstance
  const clientService = ClientService.sharedInstance
  if (!user) {
    res.status(403)
    res.send('Forbidden')
    return
  }
  const app = await appService.create(name, user)
  await clientService.create(app)
  res.redirect('/')
})

router.post(
  '/:app/update',
  authentication({ required: true }),
  async (req, res) => {
    const { user } = req.authentication
    const { redirect_uris: redirectUris, scope } = req.body
    const appId = req.params['app']
    const app = await UpdateAppUsecase.execute({
      user,
      appId,
      redirectUris: (() => {
        // 空文字排除
        const arr = redirectUris.split(',').filter((v) => !!v)
        // 重複排除
        const set = new Set(arr)
        return [...set]
      })(),
      scopes: scope
    })
    if (!app) {
      res.status(404)
      res.send('Not Found')
      return
    }
    res.redirect('back')
  }
)

router.post(
  '/:app/remove',
  authentication({ required: true }),
  async (req, res) => {
    const { user } = req.authentication
    const appId = req.params['app']
    const appService = AppService.sharedInstance
    const app = await appService.find(user, appId)
    if (!app) {
      res.status(404)
      res.send('Not Found')
      return
    }
    await appService.remove(app)
    res.redirect('/')
  }
)

router.post(
  '/:app/regenerate_secret',
  authentication({ required: true }),
  async (req, res) => {
    const { user } = req.authentication
    const appId = req.params['app']
    const clientId = req.body['client_id']
    const appService = AppService.sharedInstance
    const clientService = ClientService.sharedInstance
    const app = await appService.findById(appId)
    if (!app || app.userId !== user.id) {
      res.status(404)
      res.send('Not Found')
      return
    }
    const { client } = await clientService.find(app, clientId)
    if (!client) {
      res.status(404)
      res.send('Not Found')
      return
    }
    await clientService.regenerateSecret(client)
    res.redirect('back')
  }
)

module.exports = router
