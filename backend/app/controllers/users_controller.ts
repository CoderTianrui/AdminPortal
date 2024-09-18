import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {

  async index({ request }: HttpContext) {
    const search = request.input('search', '').toLowerCase();  
    const page = request.input('page', 1); 

    const usersQuery = User.query();

    if (search) {
        usersQuery.whereRaw('LOWER(firstName) LIKE ?', [`%${search}%`])
                  .orWhereRaw('LOWER(lastName) LIKE ?', [`%${search}%`]);
    }

    const users = await usersQuery.paginate(page);
    return users;
}

  async store({ request }: HttpContext) {
    const userData = request.only(['fulltName', 'lastName', 'email', 'profile', 'school', 'access', 'relatedNames']);
    const user = await User.create(userData);
    return user;
  }

  async show({ params }: HttpContext) {
    return await User.findOrFail(params.id)
  }

  async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id);
    const userData = request.only(['firstName', 'lastName', 'email', 'profile', 'school', 'access', 'relatedNames']);
    user.merge(userData);
    await user.save();
    return user;
  }


  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id);
    await user.delete();
    return { message: 'User deleted successfully' };
  }
}