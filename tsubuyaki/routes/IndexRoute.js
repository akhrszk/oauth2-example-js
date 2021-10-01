const express = require('express')
const { authentication } = require('../middleware')

const router = express.Router()

router.get('/', authentication(), (req, res) => {
  const { user } = req.authentication ?? {}
  res.render('index', { user })
})

module.exports = router
