const { test, trait } = use('Test/Suite')('Mood Tests');
const Mood = use('App/Models/Mood');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should create a mood', async ({ client }) => {
  const response = await client.post('/moods').send({
    name: 'Happy',
    imageUrl: 'http://example.com/happy.png',
  }).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: 'Happy',
    imageUrl: 'http://example.com/happy.png',
  });
});

test('it should fetch all moods', async ({ client }) => {
  await Mood.create({ name: 'Sad', imageUrl: 'http://example.com/sad.png' });

  const response = await client.get('/moods').end();

  response.assertStatus(200);
  response.assertJSONSubset([{
    name: 'Sad',
    imageUrl: 'http://example.com/sad.png',
  }]);
});

test('it should update a mood', async ({ client }) => {
  const mood = await Mood.create({ name: 'Excited', imageUrl: 'http://example.com/excited.png' });

  const response = await client.put(`/moods/${mood.id}`).send({
    name: 'Super Excited',
    imageUrl: 'http://example.com/super-excited.png',
  }).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: 'Super Excited',
    imageUrl: 'http://example.com/super-excited.png',
  });
});

test('it should delete a mood', async ({ client }) => {
  const mood = await Mood.create({ name: 'Angry', imageUrl: 'http://example.com/angry.png' });

  const response = await client.delete(`/moods/${mood.id}`).end();

  response.assertStatus(200);
  const findMood = await Mood.find(mood.id);
  assert.isNull(findMood);
});
