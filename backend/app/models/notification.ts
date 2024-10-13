import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
//import type { ManyToMany } from '@adonisjs/lucid/types/relations'
//import Recipient from './recipient.js'

export default class Notification extends BaseModel {
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

  //@manyToMany(() => Recipient)
  //declare recipients: ManyToMany<typeof Recipient>

  @column.dateTime()  // Add this line for the date
  declare date: DateTime;

  @column()
  declare recipients: string; // need to change later 
}