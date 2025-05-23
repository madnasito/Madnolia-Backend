import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
  @Prop({
    enum: ReportType,
    required: true,
  })
  type: ReportType;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'User',
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

export const ReportSchema = SchemaFactory.createForClass(Report);
