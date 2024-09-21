// import User from '#models/user'
// import { BasePolicy } from '@adonisjs/bouncer'
// import { AuthorizerResponse } from '@adonisjs/bouncer/types'

// export default class UserPolicy extends BasePolicy {
//   /* single user policies */
//   create(user: User): AuthorizerResponse {
//     return user.isAdmin
//   }

//   view(user: User, target: User): AuthorizerResponse {
//     return user.isAdmin || user.id === target.id
//   }

//   edit(user: User, target: User): AuthorizerResponse {
//     return user.isAdmin || user.id === target.id
//   }

//   delete(user: User, target: User): AuthorizerResponse {
//     return user.isAdmin || user.id === target.id
//   }

//   /* multiple user policies */
//   list(user: User): AuthorizerResponse {
//     return user.isAdmin
//   }
// }
