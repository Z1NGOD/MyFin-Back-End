import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrenciesDocument = HydratedDocument<Currency>;

@Schema({ versionKey: false })
export class Currency {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  exchangeRate: number;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
