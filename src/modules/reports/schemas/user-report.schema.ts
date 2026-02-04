import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { UserReportType } from '../enums/user-report-type.enum';

export type UserReportDocument = HydratedDocument<UserReport>;

@Schema()
export class UserReport {
  @Prop({
    enum: UserReportType,
    required: true,
  })
  type: UserReportType;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  to: Types.ObjectId;

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

export const UserReportSchema = SchemaFactory.createForClass(UserReport);
