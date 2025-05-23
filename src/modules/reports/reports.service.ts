import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './schema/reports.schema';
import { ReportStatus } from './enums/report-status.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<Report>,
  ) {}

  async create(body: CreateReportDto, user: Types.ObjectId) {
    const newReport = {
      ...body,
      user,
    };
    return this.reportModel.create(newReport);
  }

  updateStatus(id: Types.ObjectId, status: ReportStatus) {
    return this.reportModel.findByIdAndUpdate(id, { status });
  }
}
