const express = require('express')
const { authentication } = require('../middlewares')
const AppService = require('../service/AppService')
const IntrospectionUsecase = require('../usecase/TokenIntrospectionUsecase')
const RevokeAccessTokenUsecase = require('../usecase/RevokeAccessTokenUsecase')

const router = express.Router()

/* 内部向けAPI */
router.post('/introspection', async (req, res) => {
  const { token } = req.body
  const introspection = await IntrospectionUsecase.execute({ token })
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

router.get('/', authentication(), async (req, res) => {
  const { user } = req.authentication
  const apps = await ((user) => {
    if (user) {
      return AppService.sharedInstance.findByUser(user)
    }
    return []
  })(user)
  res.render('index', { authenticatedUser: user, apps })
})

module.exports = router
