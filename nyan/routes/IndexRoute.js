const express = require('express')
const TsubuyakiService = require('../service/TsubuyakiService')

const router = express.Router()

router.get('/', (req, res) => {
  const tsubuyakiService = TsubuyakiService.sharedInstance
  const { tsubuyakiAccessToken, tsubuyakiRefreshToken } = req.session
  const loggedIn = !!tsubuyakiAccessToken && !!tsubuyakiRefreshToken
  res.render('index', { loggedIn, oauth: { tsubuyaki: tsubuyakiService.oauthLoginUrl } })
})

module.exports = router
