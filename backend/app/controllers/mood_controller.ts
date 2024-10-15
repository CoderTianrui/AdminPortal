import type { HttpContext } from '@adonisjs/core/http'
import Mood from '#models/mood'

export default class MoodController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await Mood.query().paginate(1)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'imageUrl']);  // 只接收这两个字段
    console.log('Received data:', data); // 日志输出，检查收到的数据

    try {
        const mood = await Mood.create(data);
        return mood;
    } catch (error) {
        console.error('Error creating mood:', error);
        return response.status(500).send('Failed to create mood');
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Mood.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const mood = await Mood.findOrFail(params.id)
    mood.merge(request.all())
    await mood.save()
    return mood
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const mood = await Mood.findOrFail(params.id)
    await mood.delete()
    return mood
  }
}
