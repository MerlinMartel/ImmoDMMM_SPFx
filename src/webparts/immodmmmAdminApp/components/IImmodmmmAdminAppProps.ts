import {IExpensesService} from "../../../models/IExpensesService";
import { IWebPartContext } from "@microsoft/sp-webpart-base/lib";

export interface IImmodmmmAdminAppProps {
  expensesService:IExpensesService;
  context: IWebPartContext;
}
