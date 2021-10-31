const express = require('express')
const { authentication } = require('../middleware')
const ListStatusesUsecase = require('../usecase/ListStatusesUsecase')

const router = express.Router()

router.get('/', authentication(), async (req, res) => {
  const { user } = req.authentication ?? {}
  const statuses = await ListStatusesUsecase.execute()
  res.render('index', { user, statuses })
})

module.exports = router
