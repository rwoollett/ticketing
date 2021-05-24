export enum OrderStatus {
  // When order has been vreated, but the
  // ticket it is trying to order has not been reserved
  Created = 'created',

  // Ticket the order is trying to reserve has already
  // been reserved, or when the user has cancelled the order.
  // The order expires before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // The order has reserved ticket and user provided payment
  // successfully
  Complete = 'complete'
}