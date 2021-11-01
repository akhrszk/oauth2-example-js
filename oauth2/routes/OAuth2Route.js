const express = require('express')
const querystring = require('querystring')
const { ACCESS_TOKEN_EXPIRES_IN } = require('../common/Constants')
const LoginUsecase = require('../usecase/LoginUsecase')
const GenerateAccessTokenUsecase = require('../usecase/GenerateAccessTokenUsecase')
const RefreshAccessTokenUsecase = require('../usecase/RefreshAccessTokenUsecase')
const GenerateAuthorizationCodeUsecase = require('../usecase/GenerateAuthorizationCodeUsecase')

const router = express.Router()

router.get('/authorize', (req, res) => {
  res.render('authorize')
})

router.post('/authorize', async (req, res) => {
  const {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    state
  } = req.query
  const { email, pass } = req.body
  const user = await LoginUsecase.execute({ email, pass })
  if (!user) {
    // TODO エラー
    res.redirect('back')
    return
  }
  if (responseType !== 'code') {
    // TODO エラー
    return
  }
  const code = await GenerateAuthorizationCodeUsecase.execute({
    clientName: clientId,
    user,
    redirectUri
  })
  const query =
    code && state
      ? querystring.stringify({ code, state })
      : code
        ? querystring.stringify({ code })
        : querystring.stringify({ error: 'authorization failed' })
  res.redirect(`${redirectUri}?${query}`)
})

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
      expires_in: ACCESS_TOKEN_EXPIRES_IN,
      refresh_token: refreshToken
    })
  } else if (
    grantType === 'refresh_token' &&
    refreshToken &&
    clientName &&
    clientSecret
  ) {
    const result = await RefreshAccessTokenUsecase.execute({
      clientName,
      clientSecret,
      refreshToken
    })
    if (!result) {
      res.status(403)
      res.send('Forbidden')
      return
    }
    const { accessToken } = result
    res.json({
      access_token: accessToken,
      expires_in: ACCESS_TOKEN_EXPIRES_IN
    })
  } else {
    res.status(400)
    res.json({ error: 'unspported grant_type' })
  }
})

module.exports = router
