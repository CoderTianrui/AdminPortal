import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.enum('profile_type', ['admin', 'school', 'teacher', 'student']).notNullable()
      table.string('permission').notNullable()
      table.string('profile_image').nullable()

      table.integer('user_school_id').unsigned().references('schools.id').onDelete('CASCADE')
      table.integer('related_user_id').unsigned().references('users.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}