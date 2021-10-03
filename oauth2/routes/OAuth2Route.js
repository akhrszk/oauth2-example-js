const express = require('express')
const GenerateAccessTokenUsecase = require('../usecase/GenerateAccessTokenUsecase')
const RefreshAccessTokenUsecase = require('../usecase/RefreshAccessTokenUsecase')

const router = express.Router()

router.post('/token', async (req, res) => {
  const {
    grant_type: grantType,
    code,
    refresh_token: refreshToken,
    client_id: clientName,
    client_secret: clientSecret,
    redirect_uri: redirectUri
  } = req.body
  if (
    grantType === 'authorization_code' &&
    code &&
    clientName &&
    clientSecret &&
    redirectUri
  ) {
    const tokenSet = await GenerateAccessTokenUsecase.execute({
      clientName,
      clientSecret,
      redirectUri,
      code
    })
    if (!tokenSet) {
      res.status(401)
      res.json({ error: 'authorization failed' })
      return
    }
    const { accessToken, refreshToken } = tokenSet
    res.json({
      access_token: accessToken,
      expires_in: 30 * 60, // access_tokenの期限は30分
      refresh_token: refreshToken
    })
  } else if (
    grantType === 'refresh_token' &&
    refreshToken &&
    clientName &&
    clientSecret
  ) {
    const { accessToken } = await RefreshAccessTokenUsecase.execute({
      clientName,
      clientSecret,
      refreshToken
    })
    res.json({
      access_token: accessToken,
      expires_in: 30 * 60 // access_tokenの期限は30分
    })
  } else {
    res.status(400)
    res.json({ error: 'unspported grant_type' })
  }
})

module.exports = router
