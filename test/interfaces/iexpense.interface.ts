export interface Iexpense {
  _id: string;
  userId: string;
  currency: string;
  category: string;
  amount: number;
  date: Date;
  details: string;
}
