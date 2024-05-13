import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Category } from './category.schema';
import { Currency } from './currency.schema';

export type ExpensesDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: object;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Currency' })
  currencyId: Currency;

  @Prop()
  amount: number;

  @Prop()
  details: string;
}

export const ExpencesesSchema = SchemaFactory.createForClass(Expense);
