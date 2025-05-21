import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CanLogDocument = HydratedDocument<CanLog>;

@Schema()
export class CanLog {
  @Prop({ required: true })
  timestamp: string;

  @Prop({ required: false })
  canId: string;

  @Prop({ type: Object, required: true })
  data: any;
}

export const CanLogSchema = SchemaFactory.createForClass(CanLog);