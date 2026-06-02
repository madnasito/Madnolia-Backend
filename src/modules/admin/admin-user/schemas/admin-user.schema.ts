import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type AdminUserDocument = HydratedDocument<AdminUser>;

@Schema()
export class AdminUser {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    lastLoginAt: Date;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);