import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import ManagedModel from './managed_model.js'

export default class Event extends ManagedModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare title: string

  @column()
  declare description: string

  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime
}
