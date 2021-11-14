const express = require('express')
const { refreshAccessTokenIfNeed } = require('../../middleware')
const TsubuyakiService = require('../../service/TsubuyakiService')

const router = express.Router()

router.post('/', refreshAccessTokenIfNeed(), async (req, res) => {
  const { message } = req.body
  const accessToken = req.session.tsubuyakiAccessToken
  if (!accessToken) {
    res.status(401)
    res.send('Unauthorized')
    return
  }
  const tsubuyakiService = TsubuyakiService.sharedInstance
  const { data } = await tsubuyakiService.send(message, accessToken)
  console.log('Successfully sent to Tsubuyaki API', data)
  res.status(204)
  res.send()
})

module.exports = router
