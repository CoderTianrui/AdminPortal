import type { HttpContext } from '@adonisjs/core/http'
import School from '#models/school'

export default class SchoolsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await School.query().paginate(1)
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {
    return {
      name: '',
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    return await School.create(request.all())
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await School.findOrFail(params.id)
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {
    return await School.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const school = await School.findOrFail(params.id)
    school.merge(request.all())
    await school.save()
    return school
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const school = await School.findOrFail(params.id)
    await school.delete()
    return school
  }
}