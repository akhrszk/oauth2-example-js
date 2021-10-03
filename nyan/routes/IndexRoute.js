const express = require('express')
const TsubuyakiService = require('../service/TsubuyakiService')

const router = express.Router()

router.get('/', (req, res) => {
  const tsubuyakiService = TsubuyakiService.sharedInstance
  res.render('index', { oauth: { tsubuyaki: tsubuyakiService.oauthLoginUrl } })
})

module.exports = router
