export interface OrderCreatedMessage {
  orderId: string
  amount: number
  customer: {
    customerId: string
  }
}