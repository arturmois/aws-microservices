import type { OrderCreatedMessage } from '../../../../contracts/messages/order-create-message.ts'
import { channels } from '../channels/index.ts'

export async function dispatchOrderCreatedMessage(data: OrderCreatedMessage) {
  channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)))
}