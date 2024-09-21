import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import ManagedModel from './managed_model.js'

export default class Recipient extends ManagedModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare type: string
}
