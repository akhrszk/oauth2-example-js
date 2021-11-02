const express = require('express')
const { authorization } = require('../../middleware')
const SaveStatusUsecase = require('../../usecase/SaveStatusUsecase')

const router = express.Router()

router.post('/status', authorization({ required: true }), async (req, res) => {
  const { user, scope } = req.authorization
  const { body } = req.body
  if (!scope.includes('write')) {
    res.status(403)
    res.send('Forbidden')
    return
  }
  const status = await SaveStatusUsecase.execute({ user, status: { body } })
  res.json(status)
})

router.get('/me', authorization({ required: true }), (req, res) => {
  const { user, scope } = req.authorization
  if (!scope.includes('read')) {
    res.status(403)
    res.send('Forbidden')
    return
  }
  res.json(user)
})

module.exports = router
