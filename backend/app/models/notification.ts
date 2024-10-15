import { DateTime } from 'luxon'
import { column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import School from './school.js'
import ManagedModel from './managed_model.js'

export default class Notification extends ManagedModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare title: string

  @column()
  declare content: string

  @column()  // Add this line for the date
  declare date: string;

  @manyToMany(() => School)
  declare recipients: ManyToMany<typeof School>
}