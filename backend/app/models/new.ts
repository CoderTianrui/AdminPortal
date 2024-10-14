import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
//import type { ManyToMany } from '@adonisjs/lucid/types/relations'
//import Recipient from './recipient.js'
import Channel from './channel.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class New extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare title: string

  @column()
  declare url: string

  @column.dateTime() 
  declare date: DateTime; 

  //@manyToMany(() => Recipient)
  //declare recipients: ManyToMany<typeof Recipient>

  @column()
  declare recipients: string; //need to change it later

  @manyToMany(() => Channel, {pivotTable: 'channel_news',})
  declare channels: ManyToMany<typeof Channel>
}