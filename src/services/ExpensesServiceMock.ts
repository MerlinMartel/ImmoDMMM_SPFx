import {IExpensesService} from "../models/IExpensesService";
import {IExpense} from "../models/IExpense";
import * as _ from 'lodash';
import * as moment from "moment";
import {Reimbursement} from "../models/IReimbursement";
import {Transaction} from "../models/ITransaction";
import {TaxesCategory} from "../models/ITaxesCategory";
import {Revenu} from "../models/IRevenu";

const mockdata = [{
  "type": "Document",
  "price": 1.11,
  "validated": true,
  "id": 327,
  "created": "2014-11-24T23:00:03Z",
  "modified": "2015-03-02T01:19:21Z",
  "date": "2014-10-11T04:00:00.000Z",
  "authorId": 8,
  "title": "titre",
  "manager": "Merlin",
  "providerId": 5,
  "provider": "provider",
  "flatId": 5,
  "flat": "flat",
  "taxCategoryId": 3,
  "taxCategory": "taxCat",
  "year": 2014,
  "p": true,
  "relativeEditLink": "https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett//Depenses/Forms/EditForm.aspx?ID=327&Source=https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett/_layouts/15/workbench.aspx"
},
  {
    "type": "Document",
    "price": 1.12,
    "validated": true,
    "id": 327,
    "created": "2014-11-24T23:00:03Z",
    "modified": "2015-03-02T01:19:21Z",
    "date": "2014-10-12T04:00:00.000Z",
    "authorId": 8,
    "title": "titre2",
    "manager": "Merlin",
    "providerId": 5,
    "provider": "provider",
    "flatId": 5,
    "flat": "flat",
    "taxCategoryId": 3,
    "taxCategory": "taxCat",
    "year": 2014,
    "p": true,
    "relativeEditLink": "https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett//Depenses/Forms/EditForm.aspx?ID=327&Source=https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett/_layouts/15/workbench.aspx"
  },
  {
    "type": "Document",
    "price": 1.08,
    "validated": true,
    "id": 327,
    "created": "2014-11-24T23:00:03Z",
    "modified": "2015-03-02T01:19:21Z",
    "date": "2018-10-08T04:00:00.000Z",
    "authorId": 8,
    "title": "titre2",
    "manager": "Merlin",
    "providerId": 5,
    "provider": "provider",
    "flatId": 5,
    "flat": "flat",
    "taxCategoryId": 3,
    "taxCategory": "taxCat",
    "year": 2018,
    "p": true,
    "relativeEditLink": "https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett//Depenses/Forms/EditForm.aspx?ID=327&Source=https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett/_layouts/15/workbench.aspx"
  },
  {
    "type": "Document",
    "price": 1.08,
    "validated": true,
    "id": 327,
    "created": "2018-11-24T23:00:03Z",
    "modified": "2018-03-02T01:19:21Z",
    "date": "2018-10-08T04:00:00.000Z",
    "authorId": 8,
    "title": "titre4",
    "manager": "Merlin",
    "providerId": 5,
    "provider": "provider",
    "flatId": 5,
    "flat": "flat",
    "taxCategoryId": 3,
    "taxCategory": "taxCat",
    "year": 2018,
    "p": true,
    "relativeEditLink": "https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett//Depenses/Forms/EditForm.aspx?ID=327&Source=https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett/_layouts/15/workbench.aspx"
  }];
const mockdata2 = [{
  "title": "titre",
}];

export class ExpensesServiceMock implements IExpensesService {
  public async getExpenses(year?: number): Promise<any> {

    console.log('..ExpensesServiceMock - getExpense - begin');
    await this.timeout(1000);

    let cleanMockData: any = _.map(mockdata, (i: any) => ({
      ...i, dateValue: new Date(i.date).valueOf(), dateFormatted: moment(i.date).format('YYYY-MM-DD') //TODO : valider s'il faut le faire dans le vrai service.
    }));
    //console.log(cleanMockData);
    console.log('..ExpensesServiceMock - getExpense - end');
    return cleanMockData;

  }

  private timeout(timeInMs: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeInMs);
    });
  }

  public getTaxCategories():TaxesCategory[] {
    var toto = [];
    return toto;
  }
  public async getRevenues(year?: number): Promise<Revenu[]>{
    year = 0;
    var toto = [];
    return toto;
  }
  public async getTransactionCompte(year?: number): Promise<Transaction[]>{
    year = 0;
    var toto = [];
    return toto;
  }
  public async getReimbursement(): Promise<Reimbursement[]>{
    var toto = [];
    return toto;
  }
  public async saveExpense(expense:IExpense):Promise<any> {
    var toto = [];
    return toto;
  }
}
