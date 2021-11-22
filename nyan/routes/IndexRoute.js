const express = require('express')
const TsubuyakiService = require('../service/TsubuyakiService')
const { IS_SET_CLIENT_CREDENTIALS } = require('../common/Constants')

const router = express.Router()

router.get('/', (req, res) => {
  const tsubuyakiService = TsubuyakiService.sharedInstance
  const { tsubuyakiAccessToken, tsubuyakiRefreshToken } = req.session
  const loggedIn = !!tsubuyakiAccessToken && !!tsubuyakiRefreshToken
  res.render('index', {
    visibleLoginButton: IS_SET_CLIENT_CREDENTIALS,
    loggedIn,
    oauth: { tsubuyaki: tsubuyakiService.oauthLoginUrl }
  })
})

router.get('/login', async (req, res) => {
  if (IS_SET_CLIENT_CREDENTIALS) {
    const tsubuyakiService = TsubuyakiService.sharedInstance
    res.redirect(tsubuyakiService.oauthLoginUrl)
  } else {
    res.send('OAuthクライアントのクレデンシャルを設定してください。')
  }
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
