import {IExpense} from "./IExpense";
import {TaxesCategory} from "./ITaxesCategory";
import {Revenu} from "./IRevenu";
import {Transaction} from "./ITransaction";
import {Reimbursement} from "./IReimbursement";

export interface IExpensesService{
  getExpenses():Promise<IExpense[]>;
  getTaxCategories():TaxesCategory[];
  getRevenues(year?: number): Promise<Revenu[]>;
  getTransactionCompte(year?: number): Promise<Transaction[]>;
  getReimbursement(): Promise<Reimbursement[]>;
}
