import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserPolicy from '#policies/user_policy'
import Channel from '#models/channel'

export default class UsersController {
  async index({ bouncer, request }: HttpContext) {
    // Check if the user can list users
    await bouncer.with(UserPolicy).authorize('list')

    const search = request.input('search', '').toLowerCase()
    const page = request.input('page', 1)

    const usersQuery = User.query().preload('school')

    if (search) {
      // Search by first name or last name, optimized
      usersQuery.whereILike('firstName', `%${search}%`).orWhereILike('lastName', `%${search}%`)
    }

    const users = await usersQuery.paginate(page)
    return users
  }

  async show({ bouncer, params }: HttpContext) {
    const user = await User.query().where('id', params.id).preload('school').firstOrFail()
    // Check if the user can view the user, to be noticed time-based attacks vulnerability applied
    await bouncer.with(UserPolicy).authorize('view', user)
    return user
  }

  // Create a new user
  async store({ auth, bouncer, request, response }: HttpContext) {
    // Check if the user can create a user
    await bouncer.with(UserPolicy).authorize('create')

    // Ensure the password is included in the user data
    const userData = request.only([
      'firstName',
      'lastName',
      'email',
      'password',
      'profile',
      'school',
      'permission',
      'relatedNames',
    ])

    // Validate that the password is provided
    if (!userData.password) {
      return response.status(400).send({ message: 'Password is required' })
    }

    // Create the user
    const user = await User.create(userData)

    // Attach the owner to the user
    await user.related('ownedBy').associate(auth.user!)
    
    return response.status(201).json(user)
  }

  // Update an existing user
  async update({ bouncer, params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    // Check if the user can edit the user
    await bouncer.with(UserPolicy).authorize('edit', user)
    const userData = request.only([
      'firstName',
      'lastName',
      'email',
      'profile',
      'school',
      'permission',
      'relatedNames',
    ])
    user.merge(userData)
    await user.save()
    return user
  }

  // Delete a user
  async destroy({ bouncer, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    // Check if the user can delete the user
    await bouncer.with(UserPolicy).authorize('delete', user)
    await user.delete()
    return { message: 'User deleted successfully' }
  }

  async subscribeChannel({ params, auth, response }: HttpContext) {
    const user = auth.user!  // get current login user
    const channel = await Channel.findOrFail(params.channel_id)  // find channel

    await user.related('channels').attach([channel.id])  // subscribe channel
    return response.status(200).send({ message: 'Subscribed to channel successfully' })
  }

  
  async unsubscribeChannel({ params, auth, response }: HttpContext) {
    const user = auth.user!  
    const channel = await Channel.findOrFail(params.channel_id)  

    await user.related('channels').detach([channel.id])  
    return response.status(200).send({ message: 'Unsubscribed from channel successfully' })
  }
}
