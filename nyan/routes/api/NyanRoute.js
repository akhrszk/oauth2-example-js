const express = require('express')
const axios = require('axios')
const querystring = require('querystring')

const router = express.Router()

router.post('/', async (req, res) => {
  const { message } = req.body
  const accessToken = req.session.tsubuyakiAccessToken
  if (!accessToken) {
    res.status(401)
    res.send('401 Unauthorized')
    return
  }
  const { data } = await axios.post(
    'http://tsubuyaki:3000/api/status',
    querystring.stringify({ body: message }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
  res.status(201)
  res.json(data)
})

module.exports = router
