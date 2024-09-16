/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.resource('events', '#controllers/events_controller')
router.resource('news', '#controllers/news_controller')
router.resource('notifications', '#controllers/notifications_controller')
router.resource('recipients', '#controllers/recipients_controller')
router.resource('schools', '#controllers/schools_controller')
router.resource('sos_messages', '#controllers/sos_messages_controller')
router.resource('surveys', '#controllers/surveys_controller')
router.resource('users', '#controllers/users_controller')
router.post('login', '#controllers/login_controller.post')
