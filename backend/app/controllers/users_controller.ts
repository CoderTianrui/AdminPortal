import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const users = await User.query().paginate(1)
    return users
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    return await User.create(request.all())
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await User.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    user.merge(request.all())
    await user.save()
    return user
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
  }
}