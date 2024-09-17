/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.resource('events', '#controllers/events_controller').apiOnly()
router.resource('news', '#controllers/news_controller').apiOnly()
router.resource('notifications', '#controllers/notifications_controller').apiOnly()
router.resource('recipients', '#controllers/recipients_controller').apiOnly()
router.resource('schools', '#controllers/schools_controller').apiOnly()
router.resource('sos_messages', '#controllers/sos_messages_controller').apiOnly()
router.resource('surveys', '#controllers/surveys_controller').apiOnly()
router.resource('users', '#controllers/users_controller').apiOnly()
router.post('login', '#controllers/login_controller.post')
