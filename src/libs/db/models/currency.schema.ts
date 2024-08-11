import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrenciesDocument = HydratedDocument<Currency>;

@Schema()
export class Currency {
  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop()
  exchangeRate: number;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
