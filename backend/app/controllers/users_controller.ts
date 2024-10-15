import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserPolicy from '#policies/user_policy'
import {Profile, Access} from '../models/profile_access_enums.js'

export default class UsersController {
  async index({ bouncer, request }: HttpContext) {
    // Check if the user can list users
    await bouncer.with(UserPolicy).authorize('list')

    const search = request.input('search', '').toLowerCase()
    const page = request.input('page', 1)

    const usersQuery = User.query().preload('school').preload('relatedUsers');

    if (search) {
      usersQuery.whereLike('firstName', `%${search}%`)
        .orWhereLike('lastName', `%${search}%`)
        .orWhereLike('email', `%${search}%`)
    }

    const users = await usersQuery.paginate(page);
    return users;
  }

  async show({ bouncer, params }: HttpContext) {
    console.log('Entering show method for user ID:', params.id);
    try {
      const user = await User.query()
        .where('id', params.id)
        .preload('school')
        .preload('relatedUsers')
        .firstOrFail();

      // Check if the user can view the user, to be noticed time-based attacks vulnerability applied
      await bouncer.with(UserPolicy).authorize('view', user)

        console.log('User with related users:', user.toJSON());
        return user.toJSON();

    } catch (error) {
      return { message: 'User not found', error: error.message };
    }
  }

  // Create a new user
  async store({ auth, bouncer, request, response }: HttpContext) {
    // Check if the user can create a user
    await bouncer.with(UserPolicy).authorize('create')

    const userData = request.only(['firstName', 'lastName', 'email', 'profile', 'userSchoolId', 'access', 'relatedUsers']) as {
      firstName: string;
      lastName: string;
      email: string;
      profile: Profile;
      userSchoolId: number;
      access: Access;
      relatedUsers: number[];
      password?: string;
    };

    userData.password = 'default_password123';
    console.log('User related data: ',userData.relatedUsers);
    console.log('User data:', userData);

    const userToCreate = {
      ...userData,
      userSchoolId: userData.userSchoolId || 1
    };
    console.log('User created:', userToCreate);
    try {
      const user = await User.create(userToCreate);
      // await user.load('school');
      console.log('User:', user);


      if (userData.relatedUsers && userData.relatedUsers.length > 0) {
        const validRelatedUsers = userData.relatedUsers.filter(id => id !== null);
        console.log('Valid related users:', validRelatedUsers);
        if (validRelatedUsers.length > 0) {
          await user.related('relatedUsers').attach(validRelatedUsers);
          console.log('Related users attached');
        }
      }

      // Attach the owner to the user
      await user.related('ownedBy').associate(auth.user!)
      return response.status(201).json(user);
    } catch (error) {
      console.error('Error details:', error.message || error);
      return response.status(400).json({ message: 'Failed to create user', error: error.message });
  }
}

  // Update an existing user
  async update({ bouncer, params, request }: HttpContext) {
    const user = await User.findOrFail(params.id);
    // Check if the user can edit the user
    await bouncer.with(UserPolicy).authorize('edit', user)
    const userData = request.only(['firstName', 'lastName', 'email', 'profile', 'school', 'access', 'relatedNames']);
    user.merge(userData);
    await user.save();
    return user;
  }

  // Delete a user
  async destroy({ bouncer, params }: HttpContext) {
    const user = await User.findOrFail(params.id);
    // Check if the user can delete the user
    await bouncer.with(UserPolicy).authorize('delete', user)
    await user.delete();
    return { message: 'User deleted successfully' };
  }
}
