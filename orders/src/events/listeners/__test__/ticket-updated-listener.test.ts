import {TicketUpdatedListener} from '../ticket-updated-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {TicketUpdatedEvent} from '@rwtix/common';
import mongoose from 'mongoose';
import { Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/ticket';

const setup = async () => {
  // create instance of the listener
  const  listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  //create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 999,
    userId: 'asdf'
  }

  //create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  return { listener, ticket, data, msg };
};

it ('finds, updates and saves a ticket', async () => {
  const { listener, ticket, data, msg} = await setup();

  // call the onmessage function with the data object + message object
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);

});

it ('acks the message', async () => {
  const { listener, data, msg} = await setup();

  // call the onmessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertion to for msg ack
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version', async () => {
  const { listener, ticket, data, msg} = await setup();

  data.version = 10;
  // call the onmessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(msg.ack).not.toHaveBeenCalled();

});