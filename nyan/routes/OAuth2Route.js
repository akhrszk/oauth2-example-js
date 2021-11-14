const express = require('express')
const TsubuyakiService = require('../service/TsubuyakiService')

const router = express.Router()

router.get('/callback', async (req, res) => {
  const { code, error } = req.query
  if (error) {
    res.send(error)
    return
  }
  const tsubuyakiService = TsubuyakiService.sharedInstance
  const data = await tsubuyakiService.getAccessToken(code)
  const user = await tsubuyakiService.getMe(data['access_token'])
  console.log(user)
  req.session.tsubuyakiAccessToken = data['access_token']
  req.session.tsubuyakiRefreshToken = data['refresh_token']
  // 有効期限はjsで取り扱いやすいようにミリ秒で持つ
  req.session.tsubuyakiAccessTokenExpires =
    Date.now() + data['expires_in'] * 1000
  res.redirect('/')
})

module.exports = router
