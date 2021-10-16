const express = require('express')
const querystring = require('querystring')
const LoginUsecase = require('../usecase/LoginUsecase')
const GenerateAuthorizationCodeUsecase = require('../usecase/GenerateAuthorizationCodeUsecase')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('login')
})

router.post('/', async (req, res) => {
  const {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    state
  } = req.query
  const { email, pass } = req.body
  const user = await LoginUsecase.execute({ email, pass })
  if (!user) {
    // TODO エラーメッセージ
    res.redirect('back')
    return
  }
  if (clientId && redirectUri && responseType === 'code') {
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
  } else {
    req.session.loggedInUserId = user.id
    res.redirect('/')
  }
})

module.exports = router
