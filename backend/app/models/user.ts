import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import School from './school.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

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
  declare profileType: ['admin', 'school', 'teacher', 'student']

  @column()
  declare accessType: ['full', 'high', 'medium', 'low']

  @column()
  declare permission: string

  @column()
  declare userSchoolId: number

  @belongsTo(() => School)
  declare schoolId: BelongsTo<typeof School>

  @column()
  declare relationUserId: number

  @belongsTo(() => User)
  declare relationUser: BelongsTo<typeof User>

  @column()
  declare profileImage: string | null
}