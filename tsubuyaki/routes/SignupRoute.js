const express = require('express')
const SaveUserUsecase = require('../usecase/SaveUserUsecase')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('signup')
})
router.post('/', async (req, res) => {
  console.log(req.body)
  await SaveUserUsecase.execute(req.body)
  res.redirect('/')
})

module.exports = router
