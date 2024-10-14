import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import School from './school.js'
import PermissionService from '#services/permission_service'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  permissionNode = this.constructor.name.toLowerCase()

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare profile: string

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => JSON.parse(value),
    serializeAs: null,
  })
  declare permissionMetadata: string[]

  @computed()
  get permissions(): string[] {
    return this.permissionMetadata
  }

  async hasPermission(permission: string): Promise<boolean> {
    const effectivePermissions = await PermissionService.getUserEffectivePermissions(this)

    // match case-insensitive
    const exactMatch = effectivePermissions.find(p => p.toLowerCase().endsWith(permission.toLowerCase()))
    
    if (exactMatch) {
      return exactMatch.startsWith('+') || !exactMatch.startsWith('-')
    }
    
    return false
  }

  @column()
  declare userSchoolId: number

  @belongsTo(() => School, {
    foreignKey: 'userSchoolId', // Points to the foreign key column
  })
  declare school: BelongsTo<typeof School>

  @column()
  declare relationUserId: number

  @belongsTo(() => User, {
    foreignKey: 'relationUserId',
  })
  declare relationUser: BelongsTo<typeof User>

  @column()
  declare profileImage: string | null

  @column()
  declare ownedById: number

  @belongsTo(() => User, {
    foreignKey: 'ownedById',
  })
  declare ownedBy: BelongsTo<typeof User>
}
