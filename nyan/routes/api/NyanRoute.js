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
  const { data } = await TsubuyakiService.sharedInstance.send(
    message,
    accessToken
  )
  console.log('Successfully sent to Tsubuyaki API', data)
  res.status(201)
  res.send(data)
})

module.exports = router
