import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({ request }: HttpContext) {
    const search = request.input('search', '').toLowerCase()
    const page = request.input('page', 1)

    const usersQuery = User.query().preload('school')

    if (search) {
      usersQuery
        .whereRaw('LOWER(firstName) LIKE ?', [`%${search}%`])
        .orWhereRaw('LOWER(lastName) LIKE ?', [`%${search}%`])
    }

    const users = await usersQuery.paginate(page)
    return users
  }

  async show({ params }: HttpContext) {
    const user = await User.query().where('id', params.id).preload('school').firstOrFail()
    return user
  }

  // Create a new user
  async store({ request, response }: HttpContext) {
    // Ensure the password is included in the user data
    const userData = request.only([
      'firstName',
      'lastName',
      'email',
      'password',
      'profile',
      'school',
      'access',
      'relatedNames',
    ])

    // Validate that the password is provided
    if (!userData.password) {
      return response.status(400).send({ message: 'Password is required' })
    }

    // Create the user
    const user = await User.create(userData)
    return response.status(201).json(user)
  }

  // Update an existing user
  async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const userData = request.only([
      'firstName',
      'lastName',
      'email',
      'profile',
      'school',
      'access',
      'relatedNames',
    ])
    user.merge(userData)
    await user.save()
    return user
  }

  // Delete a user
  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return { message: 'User deleted successfully' }
  }
}
