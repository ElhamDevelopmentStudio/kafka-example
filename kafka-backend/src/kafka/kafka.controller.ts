// backend/src/kafka/kafka.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  // POST endpoint to produce a Kafka message.
  // Call this endpoint with a JSON body { "message": "your text" }
  @Post('produce')
  async produceMessage(@Body() data: { message: string }) {
    await this.kafkaService.produceMessage(data.message);
    return { status: 'Message sent to Kafka' };
  }

  // GET endpoint to retrieve all messages consumed from Kafka.
  @Get('messages')
  getMessages() {
    return this.kafkaService.getConsumedMessages();
  }
}
