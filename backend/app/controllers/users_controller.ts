import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserPolicy from '#policies/user_policy'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ bouncer }: HttpContext) {
    // validate if user is authorized to list users
    await bouncer.with(UserPolicy).authorize('list')
    const users = await User.query().paginate(1)
    return users
  }

  /**
   * Display form to create a new record
   */
  async create({ bouncer }: HttpContext) {
    // validate if user is authorized to create users
    await bouncer.with(UserPolicy).authorize('create')
    return {
      full_name: '',
      email: '',
      password: '',
      is_admin: false
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ bouncer, request }: HttpContext) {
    // validate if user is authorized to create users
    await bouncer.with(UserPolicy).authorize('create')
    return await User.create(request.all())
  }

  /**
   * Show individual record
   */
  async show({ bouncer, params }: HttpContext) {
    // validate if user is authorized to view a user
    await bouncer.with(UserPolicy).authorize('view', await User.findOrFail(params.id))
    return await User.findOrFail(params.id)
  }

  /**
   * Edit individual record
   */
  async edit({ bouncer, params }: HttpContext) {
    // validate if user is authorized to edit a user
    await bouncer.with(UserPolicy).authorize('edit', await User.findOrFail(params.id))
    return await User.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ bouncer, params, request }: HttpContext) {
    // validate if user is authorized to edit a user
    await bouncer.with(UserPolicy).authorize('edit', await User.findOrFail(params.id))
    const user = await User.findOrFail(params.id)
    user.merge(request.all())
    await user.save()
    return user
  }

  /**
   * Delete record
   */
  async destroy({ bouncer, params }: HttpContext) {
    // validate if user is authorized to delete a user
    await bouncer.with(UserPolicy).authorize('delete', await User.findOrFail(params.id))
    const user = await User.findOrFail(params.id)
    await user.delete()
  }
}