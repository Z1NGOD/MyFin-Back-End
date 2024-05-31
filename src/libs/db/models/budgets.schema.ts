import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BudgetType } from '../../../core/budgets/enum/budget.enum';
import { User } from './user.schema';
import { Currency } from './currency.schema';

export type BudgetsDocument = HydratedDocument<Budgets>;

@Schema()
export class Budgets {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Currency' })
  currencyId: Currency;
  @Prop()
  amount: number;
  @Prop({ type: String, enum: BudgetType })
  type: BudgetType;
}

export const BudgetsSchema = SchemaFactory.createForClass(Budgets);
