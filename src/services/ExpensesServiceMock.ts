import {IExpensesService} from "../models/IExpensesService";
import {IExpense} from "../models/IExpense";
import * as _ from 'lodash';

const mockdata = [{
  "type": "Document",
  "price": 1.33,
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
  "p": true,
  "relativeEditLink": "https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett//Depenses/Forms/EditForm.aspx?ID=327&Source=https://mm3mm3.sharepoint.com/sites/immoDMMM/1821Bennett/_layouts/15/workbench.aspx"
}];
const mockdata2 = [{
  "title": "titre",
}];
let year = 0;

export class ExpensesServiceMock implements IExpensesService {
  public async getExpenses(year?: number): Promise<any> {
    console.log('..ExpensesServiceMock - getExpense - begin');
    //await this.timeout(101);

    //let cleanMockData: any = _.map(mockdata, (i: any) => ({
    //  ...i, dateValue: new Date(i.date).valueOf(), dateFormatted: new Date(i.date).toLocaleString()  //TODO : valider s'il faut le faire dans le vrai service.
    //}));
    //console.log(cleanMockData);
    console.log('..ExpensesServiceMock - getExpense - end');
    return mockdata2;

  }

  private timeout(timeInMs: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeInMs);
    });
  }

}
