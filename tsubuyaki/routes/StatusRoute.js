const express = require('express')
const { authentication } = require('../middleware')
const SaveStatusUsecase = require('../usecase/SaveStatusUsecase')

const router = express.Router()

router.post('/', authentication({ required: true }), async (req, res) => {
  const { user } = req.authentication
  const { body } = req.body
  await SaveStatusUsecase.execute({
    user,
    status: { body }
  })
  res.redirect('/')
})

module.exports = router
