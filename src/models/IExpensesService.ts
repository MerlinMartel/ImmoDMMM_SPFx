import {IExpense} from "./IExpense";

export interface IExpensesService{
  getExpenses():Promise<IExpense[]>;
}
