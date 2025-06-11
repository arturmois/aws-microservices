import { ordersChannel } from "./channels/orders.ts"

ordersChannel.consume('orders', async (message) => {
  if (!message) return
  console.log(message.content.toString())
  ordersChannel.ack(message)
}, {
  noAck: false,
})