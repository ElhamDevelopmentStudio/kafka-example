// backend/src/kafka/kafka.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Client,
  ClientKafka,
  MessagePattern,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit {
  // In-memory storage for consumed messages
  private consumedMessages: string[] = [];

  // Kafka client instance used as a producer.
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafka-producer',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'producer-group',
        allowAutoTopicCreation: true,
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    try {
      console.log('Initializing Kafka service...');
      this.client.subscribeToResponseOf('messages');
      await this.client.connect();
      console.log('Successfully connected to Kafka');
    } catch (error) {
      console.error('Failed to connect to Kafka:', error);
      throw error;
    }
  }

  // Produces a message to the Kafka topic "messages"
  async produceMessage(message: string): Promise<void> {
    try {
      console.log('Attempting to produce message:', message);
      await this.client.emit('messages', { value: { message } }).toPromise();
      console.log('Message produced successfully');
    } catch (error) {
      console.error('Error producing message:', error);
      throw error;
    }
  }

  // Consumer: listens to the "messages" topic.
  // When a message is received, it is stored in memory.
  @MessagePattern('messages')
  consumeMessage(message: any): Observable<any> | any {
    try {
      const receivedMsg = message.value?.message;
      console.log('Consumed message from Kafka:', receivedMsg);
      this.consumedMessages.push(receivedMsg);
      return { status: 'Message consumed' };
    } catch (error) {
      console.error('Error consuming message:', error);
      throw error;
    }
  }

  // Returns the list of messages consumed by Kafka
  getConsumedMessages(): string[] {
    return this.consumedMessages;
  }
}
