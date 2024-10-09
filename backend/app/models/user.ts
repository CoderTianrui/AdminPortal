import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, computed, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import School from './school.js'
import Channel from './channel.js'

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
  declare profile: ['admin', 'school', 'teacher', 'student']

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

  @column()
  declare userSchoolId: number

  @belongsTo(() => School, {
    foreignKey: 'userSchoolId', // Points to the foreign key column
  })
  declare school: BelongsTo<typeof School>

  @column()
  declare relationUserId: number

  @belongsTo(() => User)
  declare relationUser: BelongsTo<typeof User>

  @column()
  declare profileImage: string | null

  @column()
  declare ownedById: number

  @belongsTo(() => User)
  declare ownedBy: BelongsTo<typeof User>

  @manyToMany(() => Channel, {
    pivotTable: 'subscriptions',
    // pivotForeignKey: 'user_id',
    // pivotRelatedForeignKey: 'channel_id'
  })
  declare channels: ManyToMany<typeof Channel>
}
