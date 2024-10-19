import { DateTime } from 'luxon'
import { column, manyToMany } from '@adonisjs/lucid/orm'
//import type { ManyToMany } from '@adonisjs/lucid/types/relations'
//import Recipient from './recipient.js'
import Channel from './channel.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import ManagedModel from './managed_model.js'

export default class New extends ManagedModel {
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

  @column()
  declare recipients: string; //need to change it later

  @manyToMany(() => Channel, {pivotTable: 'channel_news',})
  declare channels: ManyToMany<typeof Channel>
}