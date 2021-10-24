const express = require('express')
const TsubuyakiService = require('../service/TsubuyakiService')

const router = express.Router()

router.get('/', (req, res) => {
  const tsubuyakiService = TsubuyakiService.sharedInstance
  const { tsubuyakiAccessToken, tsubuyakiRefreshToken } = req.session
  const loggedIn = !!tsubuyakiAccessToken && !!tsubuyakiRefreshToken
  res.render('index', {
    loggedIn,
    oauth: { tsubuyaki: tsubuyakiService.oauthLoginUrl }
  })
})

router.get('/logout', async (req, res) => {
  const { tsubuyakiAccessToken, tsubuyakiRefreshToken } = req.session
  const tsubuyakiService = TsubuyakiService.sharedInstance
  await tsubuyakiService.revokeTokens(
    tsubuyakiAccessToken,
    tsubuyakiRefreshToken
  )
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
