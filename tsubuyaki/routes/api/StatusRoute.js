const express = require('express')
const { authorization } = require('../../middleware')
const SaveStatusUsecase = require('../../usecase/SaveStatusUsecase')

const router = express.Router()

router.post('/', authorization({ required: true }), async (req, res) => {
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

module.exports = router
