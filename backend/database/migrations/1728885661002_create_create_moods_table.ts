import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateMoodsTable extends BaseSchema {
  protected tableName = 'moods' // 表名为 moods

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // 自动递增的主键

      table.timestamp('created_at', { useTz: true }).notNullable() // 创建时间戳
      table.timestamp('updated_at', { useTz: true }).notNullable() // 更新时间戳

      // 如果你有和权限或拥有者相关的需求，可以加入这些字段，具体依据你的业务逻辑
      table.json('permission_metadata').notNullable().defaultTo(JSON.stringify([])) // 默认空的权限元数据
      table.integer('owned_by_id').unsigned().references('users.id').onDelete('CASCADE') // 外键引用 users 表中的 id

      table.string('name').notNullable() // mood 的名字字段
      table.string('image_url').notNullable(); // 在迁移文件中定义 imageUrl 字段

    })
  }

  public async down() {
    this.schema.dropTable(this.tableName) // 删除表
  }
}

