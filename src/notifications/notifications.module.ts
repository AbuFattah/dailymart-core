import { Module } from '@nestjs/common';
import { NotificationsController } from './controller/notifications/notifications.controller';
import { NotificationsService } from './services/notifications/notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
