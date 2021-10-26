const express = require('express')
const ClientService = require('../service/ClientService')
const CreateClientUsecase = require('../usecase/CreateClientUsecase')
const UpdateClientUsecase = require('../usecase/UpdateClientUsecase')

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
  if (user) {
    await CreateClientUsecase.execute({ label, user })
  }
  res.redirect('/')
})

router.post('/update', async (req, res) => {
  const {
    client_name: clientName,
    redirect_uris: redirectUris,
    scope
  } = req.body
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

module.exports = router
