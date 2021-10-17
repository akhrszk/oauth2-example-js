const express = require('express')
const TsubuyakiService = require('../service/TsubuyakiService')

const router = express.Router()

router.get('/callback', async (req, res) => {
  const { code, error } = req.query
  if (error) {
    res.send(error)
    return
  }
  const data = await TsubuyakiService.sharedInstance.getAccessToken(code)
  req.session.tsubuyakiAccessToken = data['access_token']
  req.session.tsubuyakiRefreshToken = data['refresh_token']
  req.session.tsubuyakiAccessTokenExpires = Date.now() + data['expires_in']
  res.redirect('/')
})

module.exports = router
