const express = require('express')
const LoginUsecase = require('../usecase/LoginUsecase')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('login')
})

router.post('/', async (req, res) => {
  const { email, pass } = req.body
  const user = await LoginUsecase.execute({ email, pass })
  if (!user) {
    // エラー
    res.redirect('back')
    return
  }
  req.session.loggedInUserId = user.id
  res.redirect('/')
})

module.exports = router
