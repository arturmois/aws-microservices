import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { prisma } from '../db/client.ts'
import { dispatchOrderCreatedMessage } from '../broker/messages/order-created.ts'
import { randomUUID } from 'node:crypto'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.register(fastifyCors, {
  origin: '*',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', (request, reply) => {
  return 'OK'
})

app.post('/orders', {
  schema: {
    body: z.object({
      amount: z.coerce.number(),
    }),
  },
}, async (request, reply) => {
  const { amount } = request.body
  const orderId = randomUUID()
  await dispatchOrderCreatedMessage({
    orderId,
    amount,
    customer: {
      customerId: '12959b42-148a-449b-9251-d3d0ef655a7e',
    },
  })
  console.log('order created')
  await prisma.order.create({
    data: {
      order_id: orderId,
      amount,
      customer_id: '12959b42-148a-449b-9251-d3d0ef655a7e',
    },
  })
  return reply.status(201).send()
})

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('[Orders] HTTP server running!')
})