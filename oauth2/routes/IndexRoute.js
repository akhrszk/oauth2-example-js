const express = require('express')
const ListClientsUsecase = require('../usecase/ListClientsUsecase')
const IntrospectionUsecase = require('../usecase/TokenIntrospectionUsecase')
const RevokeAccessTokenUsecase = require('../usecase/RevokeAccessTokenUsecase')

const router = express.Router()

router.get('/', async (req, res) => {
  const user = req.authenticatedUser
  let clients = []
  if (user) {
    clients = await ListClientsUsecase.execute(user)
  }
  res.render('index', { authenticatedUser: user, clients })
})

router.post('/introspection', async (req, res) => {
  const { token } = req.body
  const introspection = await IntrospectionUsecase.execute(token)
  if (introspection) {
    res.json({
      active: true,
      ...introspection
    })
  } else {
    res.json({
      active: false
    })
  }
})

router.post('/revoke', async (req, res) => {
  const { access_token: accessToken, refresh_token: refreshToken } = req.body
  await RevokeAccessTokenUsecase.execute({ accessToken, refreshToken })
  res.status(201)
  res.send()
})

module.exports = router
