import type { HttpContext } from '@adonisjs/core/http'
import New from '#models/new'

export default class NewsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await New.query().paginate(1)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    return await New.create(request.all())
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await New.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const _new = await New.findOrFail(params.id)
    _new.merge(request.all())
    await _new.save()
    return _new
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const _new = await New.findOrFail(params.id)
    await _new.delete()
    return _new
  }
}
