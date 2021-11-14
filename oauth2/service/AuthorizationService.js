const { models } = require('../models')
const {
  generateAuthorizationCode,
  generateAccessToken,
  generateRefreshToken
} = require('../common/Functions')

class AuthorizationService {
  constructor(models) {
    this.models = models
  }

  async findAuthorizationCode(client, code) {
    const authorizationCode = await models.AuthorizationCode.findOne({
      where: { clientId: client.id, code },
      include: [models.Scope]
    })
    if (authorizationCode.isUsed || authorizationCode.isExpired) {
      return undefined
    }
    return authorizationCode
  }

  async createAuthorizationCode(client, scope, user) {
    const scopes = await models.Scope.findAll({ where: { scope } })
    const authorizationCode = await models.AuthorizationCode.create({
      clientId: client.id,
      code: generateAuthorizationCode(),
      userId: user.id
    })
    await models.AuthorizationCodeScope.bulkCreate(
      scopes.map(({ id: scopeId }) => ({
        authorizationCodeId: authorizationCode.id,
        scopeId
      }))
    )
    authorizationCode.scopes = scopes
    return authorizationCode
  }

  useAuthorizationCode(authorizationCode) {
    authorizationCode.isUsed = true
    return authorizationCode.save()
  }

  async findAccessToken(token) {
    const accessToken = await this.models.AccessToken.findOne({
      where: { token }
    })
    if (!accessToken || accessToken.isRevoked || accessToken.isExpired) {
      return {}
    }
    const { Scopes: scopes } = await this.models.AuthorizationCode.findByPk(
      accessToken.authorizationCodeId,
      {
        include: [this.models.Scope]
      }
    )
    return { accessToken, scopes }
  }

  async findRefreshToken(token) {
    const refreshToken = await this.models.RefreshToken.findOne({
      where: { token }
    })
    if (!refreshToken) {
      return {}
    }
    const { Scopes: scopes } = await this.models.AuthorizationCode.findByPk(
      refreshToken.authorizationCodeId,
      {
        include: [this.models.Scope]
      }
    )
    return { refreshToken, scopes }
  }

  async createAccessToken(client, authorizationCode) {
    const [accessToken, refreshToken] = await Promise.all([
      models.AccessToken.create({
        clientId: client.id,
        userId: authorizationCode.userId,
        authorizationCodeId: authorizationCode.id,
        token: generateAccessToken()
      }),
      models.RefreshToken.create({
        clientId: client.id,
        userId: authorizationCode.userId,
        authorizationCodeId: authorizationCode.id,
        token: generateRefreshToken()
      })
    ])
    return { accessToken, refreshToken }
  }

  async refreshAccessToken(refreshToken) {
    const { clientId, userId, authorizationCodeId } = refreshToken
    const accessToken = models.AccessToken.create({
      clientId,
      userId,
      authorizationCodeId,
      token: generateAccessToken()
    })
    return accessToken
  }

  revokeAccessToken(token) {
    return this.models.AccessToken.update(
      { isRevoked: true },
      { where: { token } }
    )
  }

  revokeRefreshToken(token) {
    return this.models.RefreshToken.update(
      { isRevoked: true },
      { where: { token } }
    )
  }

  static get sharedInstance() {
    if (!this._sharedInstance) {
      this._sharedInstance = new AuthorizationService(models)
    }
    return this._sharedInstance
  }
}

module.exports = AuthorizationService
