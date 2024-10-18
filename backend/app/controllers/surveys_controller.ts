import type { HttpContext } from '@adonisjs/core/http'
import Survey from '#models/survey'

export default class SurveysController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await Survey.query().paginate(1)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    return await Survey.create(request.all())
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Survey.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const survey = await Survey.findOrFail(params.id)
    survey.merge(request.all())
    await survey.save()
    return survey
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const survey = await Survey.findOrFail(params.id)
    await survey.delete()
    return survey
  }
}
