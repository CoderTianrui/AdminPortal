const { test, trait } = use('Test/Suite')('SOSMessage Tests');
const SOSMessage = use('App/Models/SOSMessage');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should create an SOS message', async ({ client }) => {
  const response = await client.post('/sos_messages').send({
    name: 'John Doe',
    email: 'john@example.com',
    school: 'Sydney Uni',
    contact: '123456789',
    batch: '2024',
  }).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: 'John Doe',
    email: 'john@example.com',
    school: 'Sydney Uni',
    contact: '123456789',
    batch: '2024',
  });
});

test('it should fetch all SOS messages', async ({ client }) => {
  await SOSMessage.create({
    name: 'Jane Doe',
    email: 'jane@example.com',
    school: 'Melbourne Uni',
    contact: '987654321',
    batch: '2023',
  });

  const response = await client.get('/sos_messages').end();

  response.assertStatus(200);
  response.assertJSONSubset([{
    name: 'Jane Doe',
    email: 'jane@example.com',
    school: 'Melbourne Uni',
    contact: '987654321',
    batch: '2023',
  }]);
});

test('it should update an SOS message', async ({ client }) => {
  const sosMessage = await SOSMessage.create({
    name: 'Mark Smith',
    email: 'mark@example.com',
    school: 'Sydney Uni',
    contact: '555555555',
    batch: '2022',
  });

  const response = await client.put(`/sos_messages/${sosMessage.id}`).send({
    name: 'Mark Updated',
    email: 'mark.updated@example.com',
    contact: '999999999',
  }).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: 'Mark Updated',
    email: 'mark.updated@example.com',
    contact: '999999999',
  });
});

test('it should delete an SOS message', async ({ client }) => {
  const sosMessage = await SOSMessage.create({
    name: 'Alice Doe',
    email: 'alice@example.com',
    school: 'Sydney Uni',
    contact: '777777777',
    batch: '2025',
  });

  const response = await client.delete(`/sos_messages/${sosMessage.id}`).end();

  response.assertStatus(200);
  const findSOSMessage = await SOSMessage.find(sosMessage.id);
  assert.isNull(findSOSMessage);
});
