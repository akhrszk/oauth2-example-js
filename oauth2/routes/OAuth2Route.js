const express = require('express')
const querystring = require('querystring')
const { ACCESS_TOKEN_EXPIRES_IN } = require('../common/Constants')
const AppService = require('../service/AppService')
const ClientService = require('../service/ClientService')
const LoginUsecase = require('../usecase/LoginUsecase')
const GenerateAccessTokenUsecase = require('../usecase/GenerateAccessTokenUsecase')
const RefreshAccessTokenUsecase = require('../usecase/RefreshAccessTokenUsecase')
const GenerateAuthorizationCodeUsecase = require('../usecase/GenerateAuthorizationCodeUsecase')

const router = express.Router()

router.get('/authorize', async (req, res) => {
  const {
    client_id: clientName,
    redirect_uri: redirectUri,
    response_type: responseType,
    email,
    pass,
    authorize,
    scope,
    state
  } = req.query
  const appService = AppService.sharedInstance
  const clientService = ClientService.sharedInstance
  const { client, scopes: clientScopes } = await clientService.findByName(
    clientName
  )
  if (typeof scope !== 'string') {
    res.status(400)
    res.send('Bad Request')
    return
  }
  const requestScopes = scope.split(' ')
  const scopeChecked = (() => {
    const having = clientScopes.map(({ scope }) => scope)
    return requestScopes.every((v) => having.includes(v))
  })()
  if (!client || !scopeChecked || responseType !== 'code') {
    /* 注) response_typeはcodeのみサポートする */
    res.status(400)
    res.send('Bad Request')
    return
  }
  if (!authorize) {
    // 認可ページ表示
    const app = await appService.findByClient(client)
    res.render('authorize', {
      app,
      scope,
      clientName,
      responseType,
      redirectUri,
      state
    })
    return
  }
  const user = await LoginUsecase.execute({ email, pass })
  if (!user) {
    res.redirect('back')
    return
  }
  const code = await GenerateAuthorizationCodeUsecase.execute({
    clientName,
    user,
    scopes: requestScopes,
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
      access_token: accessToken.token,
      expires_in: ACCESS_TOKEN_EXPIRES_IN,
      refresh_token: refreshToken.token
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
    const { token } = result
    res.json({
      access_token: token,
      expires_in: ACCESS_TOKEN_EXPIRES_IN
    })
  } else {
    res.status(400)
    res.json({ error: 'unspported grant_type' })
  }
})

module.exports = router
