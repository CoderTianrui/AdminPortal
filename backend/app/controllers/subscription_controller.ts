import type { HttpContext } from '@adonisjs/core/http'
import Subscription from '#models/subscriptions'
// import Channel from '#models/channels';
// import User from '#models/user';

export default class SubscriptionsController {
  async index({}: HttpContext) {
    return await Subscription.query().paginate(1)
  }
  async store({ request }: HttpContext) {
    return await Subscription.create(request.all())
  }
  async show({ params }: HttpContext) {
    return await Subscription.findOrFail(params.id)
  }
  async update({ params, request }: HttpContext) {
    const newItem = await Subscription.findOrFail(params.id)
    newItem.merge(request.all())
    await newItem.save()
    return newItem
  }
  async destroy({ params }: HttpContext) {
    const newItem = await Subscription.findOrFail(params.id)
    await newItem.delete()
    return newItem
  }
  // async index({}: HttpContext) {
  //   const subscriptions = await Subscription.query()
  //     .select('subscriptions.id', 'subscriptions.channel_id', 'subscriptions.user_id', 'subscriptions.created_at', 'subscriptions.updated_at')
  //     .preload('channel', (channelQuery) => {
  //       channelQuery.select('title');
  //     })
  //     .preload('user', (userQuery) => {
  //       userQuery.select('first_name', 'last_name');
  //     });

  //   return subscriptions;
  // }

}
