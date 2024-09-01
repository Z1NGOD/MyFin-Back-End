import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Category } from './category.schema';
import { Currency } from './currency.schema';

export type ExpensesDocument = HydratedDocument<Expense>;

@Schema({ timestamps: true, versionKey: false })
export class Expense {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  categoryId: Category;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency',
    required: true,
  })
  currencyId: Currency;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  details: string;
}

export const ExpensesSchema = SchemaFactory.createForClass(Expense);
