import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column, manyToMany} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import School from './school.js'
import {Profile, Access} from './profile_access_enums.js'


const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare profile: Profile

  @column()
  declare access: Access

  @column()
  declare userSchoolId: number | null


  @belongsTo(() => School, {
    foreignKey: 'userSchoolId', 
  })
  public school!: BelongsTo<typeof School>; 

  @manyToMany(() => User, {
    pivotTable: 'related_users',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'related_user_id',
    pivotTimestamps: true,  
  })
  declare relatedUsers: ManyToMany<typeof User>;




  @column()
  declare profileImage: string | null
}