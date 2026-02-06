import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BugReport, BugReportSchema } from './schemas/bug-report.schema';
import { UserReport, UserReportSchema } from './schemas/user-report.schema';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserReport.name, schema: UserReportSchema }]),
    MongooseModule.forFeature([{ name: BugReport.name, schema: BugReportSchema }]),
    UsersModule,
    MailModule,
    ConfigModule,
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
