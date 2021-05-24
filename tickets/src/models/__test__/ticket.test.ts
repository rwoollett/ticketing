import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  // Create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  })

  // Save ticket
  await ticket.save();

  // Fetch twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the ticket we fetched
  firstInstance!.set({price: 10});
  secondInstance!.set({price: 15});

  // save the first ticket
  await firstInstance!.save();

  // save second fetched ticket
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }
  throw new Error('Should not reach this point');

});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);



});

