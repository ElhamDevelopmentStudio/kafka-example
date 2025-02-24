// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [KafkaModule],
})
export class AppModule {}
