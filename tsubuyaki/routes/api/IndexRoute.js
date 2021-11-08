const express = require('express')
const { authorization } = require('../../middleware')
const SaveStatusUsecase = require('../../usecase/SaveStatusUsecase')

const router = express.Router()

router.post(
  '/status',
  authorization({ required: ['read', 'write'] }),
  async (req, res) => {
    const { user } = req.authorization
    const { body } = req.body
    const status = await SaveStatusUsecase.execute({ user, status: { body } })
    res.json(status)
  }
)

router.get('/me', authorization({ required: ['read'] }), (req, res) => {
  const { user } = req.authorization
  res.json(user)
})

module.exports = router
