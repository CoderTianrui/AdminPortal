import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recipients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.string('type').notNullable()

      table.integer('new_id').unsigned().references('news.id').onDelete('CASCADE')
      table.integer('survey_id').unsigned().references('surveys.id').onDelete('CASCADE')
      table.integer('notification_id').unsigned().references('notifications.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}