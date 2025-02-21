// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Connect a Kafka microservice instance for consuming messages.
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafka-backend',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'backend-consumer-group',
        allowAutoTopicCreation: true,
      },
    },
  });

  // Start both HTTP server and Kafka microservice listener
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('Backend is running on http://localhost:3000');
}
bootstrap();
