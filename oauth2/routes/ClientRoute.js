const express = require('express')
const ListClientsUsecase = require('../usecase/ListClientsUsecase')
const CreateClientUsecase = require('../usecase/CreateClientUsecase')
const UpdateClientUsecase = require('../usecase/UpdateClientUsecase')

const router = express.Router()

router.get('/create', async (req, res) => {
  const user = req.authenticatedUser
  let clients = []
  if (user) {
    clients = await ListClientsUsecase.execute(user)
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
  const { client_name: clientName, redirect_uris: redirectUris } = req.body
  await UpdateClientUsecase.execute({
    clientName,
    redirectUris: redirectUris.split(',')
  })
  res.redirect('/')
})

module.exports = router
