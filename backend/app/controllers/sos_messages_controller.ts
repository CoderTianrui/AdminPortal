import type { HttpContext } from '@adonisjs/core/http'
import SosMessage from '#models/sos_message'

export default class SosMessagesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await SosMessage.query().paginate(1)
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {
    return {
      message: '',
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    return await SosMessage.create(request.all())
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await SosMessage.findOrFail(params.id)
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {
    return await SosMessage.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const sosMessage = await SosMessage.findOrFail(params.id)
    sosMessage.merge(request.all())
    await sosMessage.save()
    return sosMessage
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const sosMessage = await SosMessage.findOrFail(params.id)
    await sosMessage.delete()
    return sosMessage
  }
}