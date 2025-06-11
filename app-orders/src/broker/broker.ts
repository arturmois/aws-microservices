import amqplib from 'amqplib';

if (!process.env.RABBITMQ_URL) {
  throw new Error('RABBITMQ_URL is not set');
}

export const broker = await amqplib.connect(process.env.RABBITMQ_URL);
