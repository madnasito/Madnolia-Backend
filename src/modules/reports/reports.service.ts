import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReportStatus } from './enums/report-status.enum';
import { CreateUserReportDto } from './dtos/create-user-report.dto';
import { CreateBugReportDto } from './dtos/create-bug-report.dto';
import { UserReport } from './schemas/user-report.schema';
import { BugReport } from './schemas/bug-report.schema';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { UserReportType } from './enums/user-report-type.enum';
import { BugReportType } from './enums/bug-report-type.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(UserReport.name)
    private userReportModel: Model<UserReport>,
    @InjectModel(BugReport.name)
    private bugReportModel: Model<BugReport>,
    private usersService: UsersService,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  async createUserReport(body: CreateUserReportDto, user: Types.ObjectId) {
    const newReport = {
      ...body,
      user,
      date: new Date().toUTCString(),
    };

    const userDb = await this.usersService.findOneById(body.to);
    if (!userDb) throw new NotFoundException('USER_NOT_FOUND');

    const reportDb = await this.userReportModel.findOne({
      user,
      to: body.to,
      $or: [
        { status: ReportStatus.OPEN },
        { status: ReportStatus.UNDER_REVIEW },
      ],
    });

    if (reportDb) throw new ConflictException('REPORT_EXISTS');
    const createdReport = await this.userReportModel.create(newReport);

    // Send Email Notification
    const reporter = await this.usersService.findOneById(user);
    const reportsEmail = this.config.get<string>('REPORTS_EMAIL');
    
    if (reportsEmail && reporter) {
      await this.mailService.sendReportNotification(reportsEmail, {
        reportType: 'User Report',
        reporterName: reporter.name,
        reporterEmail: reporter.email,
        reportedUserName: userDb.name,
        reportedUserEmail: userDb.email,
        reason: UserReportType[body.type],
        description: body.description,
        media: body.media,
      });
    }

    return createdReport;
  }

  async createBugReport(body: CreateBugReportDto, user: Types.ObjectId) {
    const newReport = {
      ...body,
      user,
      date: new Date().toUTCString(),
    };

    // const reportDb = await this.bugReportModel.findOne({
    //   user,
    //   $or: [
    //     { status: ReportStatus.OPEN },
    //     { status: ReportStatus.UNDER_REVIEW },
    //   ],
    // });

    // if (reportDb) throw new ConflictException('REPORT_EXISTS');
    const createdReport = await this.bugReportModel.create(newReport);

    // Send Email Notification
    const reporter = await this.usersService.findOneById(user);
    const reportsEmail = this.config.get<string>('REPORTS_EMAIL');

    if (reportsEmail && reporter) {
      await this.mailService.sendReportNotification(reportsEmail, {
        reportType: 'Bug Report',
        reporterName: reporter.name,
        reporterEmail: reporter.email,
        reason: BugReportType[body.type],
        description: body.description,
        media: body.media,
      });
    }

    return createdReport;
  }

  // updateStatus(id: Types.ObjectId, status: ReportStatus) {
  //   return this.reportModel.findByIdAndUpdate(id, { status });
  // }
}
