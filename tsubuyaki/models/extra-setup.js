const { toSeconds } = require('../common/Functions')

module.exports = {
  applyExtraSetup: (sequelize) => {
    const { User, Status } = sequelize.models
    Status.belongsTo(User, { foreignKey: 'userId' })

    User.prototype.toJSON = function () {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        updatedAt: toSeconds(this.updatedAt),
        created_at: toSeconds(this.createdAt)
      }
    }
    Status.prototype.toJSON = function () {
      return {
        id: this.id,
        body: this.body,
        user: (() => {
          const { id, name, created_at } = this.User.toJSON()
          return {
            id,
            name,
            created_at
          }
        })(),
        created_at: toSeconds(this.createdAt)
      }
    }
  }
}
