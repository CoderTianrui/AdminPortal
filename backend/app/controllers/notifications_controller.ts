import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'

export default class NotificationsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await Notification.query().paginate(1)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    return await Notification.create(request.all())
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Notification.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const notification = await Notification.findOrFail(params.id)
    notification.merge(request.all())
    await notification.save()
    return notification
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const notification = await Notification.findOrFail(params.id)
    await notification.delete()
    return notification
  }
}
