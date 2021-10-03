const { models } = require('../models')

exports.execute = async (params) => {
  const { clientName, redirectUris } = params
  const client = await models.Client.findOne({ where: { name: clientName } })
  if (!client) {
    return undefined
  }
  const foundUris = (
    await models.RedirectUri.findAll({ where: { clientId: client.id } })
  ).map(({ uri }) => uri)
  const deleteUris = foundUris.filter((uri) => !redirectUris.includes(uri))
  const createUris = redirectUris.filter((uri) => !foundUris.includes(uri))
  await Promise.all([
    models.RedirectUri.destroy({
      where: { clientId: client.id, uri: deleteUris }
    }),
    models.RedirectUri.bulkCreate(
      createUris.map((uri) => {
        return { clientId: client.id, uri }
      })
    )
  ])
  return await models.Client.findByPk(client.id, {
    include: [models.RedirectUri]
  })
}
