const express = require('express')
const ClientService = require('../service/ClientService')
const UpdateClientUsecase = require('../usecase/UpdateClientUsecase')
const RemoveClientUsecase = require('../usecase/RemoveClientUsecase')

const router = express.Router()

router.get('/create', async (req, res) => {
  const user = req.authenticatedUser
  let clients = []
  if (user) {
    clients = await ClientService.newInstance().findByUser(user)
  }
  res.render('clients/create', { clients })
})

router.post('/create', async (req, res) => {
  const { label } = req.body
  const user = req.authenticatedUser
  const clientService = ClientService.newInstance()
  if (user) {
    await clientService.create(label, user)
  }
  res.redirect('/')
})

router.post('/:client/update', async (req, res) => {
  const {
    redirect_uris: redirectUris,
    scope
  } = req.body
  const clientName = req.params['client']
  await UpdateClientUsecase.execute({
    clientName,
    redirectUris: (() => {
      // 空文字排除
      const arr = redirectUris.split(',').filter((v) => !!v)
      // 重複排除
      const set = new Set(arr)
      return [...set]
    })(),
    scopes: scope
  })
  res.redirect('/')
})

router.post('/:client/remove', async (req, res) => {
  const clientName = req.params['client']
  await RemoveClientUsecase.execute({ clientName })
  res.redirect('/')
})

router.post('/:client/regenerate_secret', async (req, res) => {
  const clientName = req.params['client']
  const clientService = ClientService.newInstance()
  const client = await clientService.findByName(clientName)
  await clientService.regenerateSecret(client)
  res.redirect('/')
})

module.exports = router
