import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import {Profile, Access} from '../models/profile_access_enums.js'

export default class UsersController {

  async index({ request }: HttpContext) {
    const search = request.input('search', '').toLowerCase();  
    const page = request.input('page', 1); 

    const usersQuery = User.query().preload('school').preload('relatedUsers');  


    if (search) {
      usersQuery.whereRaw('LOWER(firstName) LIKE ?', [`%${search}%`])
                .orWhereRaw('LOWER(lastName) LIKE ?', [`%${search}%`]);
    }

    const users = await usersQuery.paginate(page);
    return users;
  }

  async show({ params }: HttpContext) {
    console.log('Entering show method for user ID:', params.id);
    try {
      const user = await User.query()
        .where('id', params.id)
        .preload('school')  
        .preload('relatedUsers') 
        .firstOrFail();  

        console.log('User with related users:', user.toJSON());
        return user.toJSON();
        
    } catch (error) {
      return { message: 'User not found', error: error.message };
    }
  }


  async store({ request, response }: HttpContext) {

    
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
        

    

        return response.status(201).json(user);
      } catch (error) {
        console.error('Error details:', error.message || error);
        return response.status(400).json({ message: 'Failed to create user', error: error.message });
    }
  }

  // Update an existing user
  async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id);
    const userData = request.only(['firstName', 'lastName', 'email', 'profile', 'school', 'access', 'relatedNames']);
    user.merge(userData);
    await user.save();
    return user;
  }

  // Delete a user
  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id);
    await user.delete();
    return { message: 'User deleted successfully' };
  }
}
