const AppService = require('../service/AppService')

exports.execute = async (params) => {
  const { user, appId, redirectUris, scopes } = params
  const appService = AppService.sharedInstance
  const app = await appService.find(user, appId)
  if (!app) {
    return undefined
  }
  await Promise.all([
    appService.setScopes(app, scopes),
    appService.setRedirectUris(app, redirectUris)
  ])
  return await appService.findById(appId)
}
