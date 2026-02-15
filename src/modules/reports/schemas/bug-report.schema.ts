import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { BugReportType } from '../enums/bug-report-type.enum';

export type BugReportDocument = HydratedDocument<BugReport>;

@Schema()
export class BugReport {
  @Prop({
    enum: BugReportType,
    required: true,
  })
  type: BugReportType;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
  })
  media: string;

  @Prop({
    default: new Date(),
  })
  date: Date;

  @Prop({
    enum: ReportStatus,
    default: ReportStatus.OPEN,
  })
  status: ReportStatus;
}

export const BugReportSchema = SchemaFactory.createForClass(BugReport);
