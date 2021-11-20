const express = require('express')
const querystring = require('querystring')
const { ACCESS_TOKEN_EXPIRES_IN } = require('../common/Constants')
const AppService = require('../service/AppService')
const ClientService = require('../service/ClientService')
const AuthorizationService = require('../service/AuthorizationService')
const LoginUsecase = require('../usecase/LoginUsecase')
const GenerateAccessTokenUsecase = require('../usecase/GenerateAccessTokenUsecase')
const RefreshAccessTokenUsecase = require('../usecase/RefreshAccessTokenUsecase')

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
  const clientService = ClientService.sharedInstance
  const { client, scopes, redirectUris } = await clientService.findByName(
    clientName
  )
  if (!client) {
    res.status(403)
    res.send('Forbidden')
    return
  }
  if (!authorize) {
    // 認可ページ表示
    const appService = AppService.sharedInstance
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
  if (!redirectUris.map(({ uri }) => uri).includes(redirectUri)) {
    res.status(400)
    res.send('Invalid redirect_uri')
    return
  }
  const requestScopes = (typeof scope === 'string' ? scope : '').split(' ')
  const scopeChecked = (() => {
    const having = scopes.map(({ scope }) => scope)
    return requestScopes.every((v) => having.includes(v))
  })()
  if (!scopeChecked || responseType !== 'code') {
    const query = querystring.stringify({
      error: !scopeChecked
        ? 'invalid_scope'
        : responseType !== 'code'
          ? 'unsupported_response_type'
          : 'invalid_request'
    })
    res.redirect(`${redirectUri}?${query}`)
    return
  }
  const user = await LoginUsecase.execute({ email, pass })
  if (!user) {
    res.redirect('back')
    return
  }
  const authorizationService = AuthorizationService.sharedInstance
  const created = await authorizationService.createAuthorizationCode(
    client,
    requestScopes,
    user
  )
  if (!created) {
    const query = querystring.stringify({ error: 'invalid_request' })
    res.redirect(`${redirectUri}?${query}`)
    return
  }
  const { code } = created
  const query = querystring.stringify({ code, ...(state ? { state } : {}) })
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
  if (grantType === 'authorization_code') {
    if (!code || !clientName || !clientSecret || !redirectUri) {
      res.status(400)
      res.json({ error: 'invalid_request' })
      return
    }
    const created = await GenerateAccessTokenUsecase.execute({
      clientName,
      clientSecret,
      redirectUri,
      code
    })
    if (!created) {
      res.status(400)
      res.json({ error: 'invalid_client' })
      return
    }
    const { accessToken, refreshToken, scopes } = created
    res.json({
      token_type: 'beare',
      access_token: accessToken.token,
      expires_in: ACCESS_TOKEN_EXPIRES_IN,
      refresh_token: refreshToken.token,
      scope: scopes
        .sort((a, b) => a - b)
        .map(({ scope }) => scope)
        .join(' ')
    })
  } else if (grantType === 'refresh_token') {
    if (!refreshToken || !clientName || !clientSecret) {
      res.status(400)
      res.json({ error: 'invalid_request' })
      return
    }
    const refreshed = await RefreshAccessTokenUsecase.execute({
      refreshToken,
      clientName,
      clientSecret
    })
    if (!refreshed) {
      res.status(400)
      res.send('invalid_request')
      return
    }
    const { accessToken, scopes } = refreshed
    res.json({
      token_type: 'beare',
      access_token: accessToken.token,
      expires_in: ACCESS_TOKEN_EXPIRES_IN,
      scope: scopes
        .sort((a, b) => a - b)
        .map(({ scope }) => scope)
        .join(' ')
    })
  } else {
    res.status(400)
    res.json({ error: 'unsupported_grant_type' })
  }
})

module.exports = router
