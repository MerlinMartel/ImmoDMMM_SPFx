import * as pnp from 'sp-pnp-js';
import {IExpense} from "../models/IExpense";
import {IProvider} from "../models/IProvider";
import {TaxonomyHiddenListItem} from "../models/ITaxonomyHiddenListItem";
import IWebPartContext from "@microsoft/sp-webpart-base/lib/core/IWebPartContext";
import * as _ from 'lodash';
import {async} from "q";

export class ExpensesService {
  //implements IExpensesService
  private expenses: any;
  private providers: IProvider[];
  private taxonomyHiddenListItems: TaxonomyHiddenListItem[];
  private siteCollUrl:string;
  private webUrl:string;


  public constructor (spfxContext:IWebPartContext){

    this.siteCollUrl = `${spfxContext.pageContext.site.absoluteUrl}/`;
    this.webUrl = `${spfxContext.pageContext.web.absoluteUrl}/`;
    pnp.setup({
      spfxContext: spfxContext
    });

  }


  public async getExpenses(year?: number): Promise<IExpense[]> {
    console.log('ExpensesService - getExpenses');
    this.expenses = []; // Reset Array, because of the push...it was accumulating
    this.providers = [];
    this.taxonomyHiddenListItems = [];
    let batch = pnp.sp.createBatch();
    if (year !== undefined) {
      // Content type 0x012000532D570857F0FA419A99D34691A46D25 == Folder content type
      let dateFilterStringForSpecificYearDoc = "Date1 gt '" + year + "-01-01T00:00:00Z' and Date1 lt '" + year + "-12-31T00:00:00Z' and ContentTypeId ne '0x012000532D570857F0FA419A99D34691A46D25'";
      let dateFilterStringForSpecificYearItem = "Date gt '" + year + "-01-01T00:00:00Z' and Date lt '" + year + "-12-31T00:00:00Z' and ContentTypeId ne '0x012000532D570857F0FA419A99D34691A46D25'";
      if (year === 0) {
        dateFilterStringForSpecificYearDoc = "Date1 eq null and ContentTypeId ne '0x012000532D570857F0FA419A99D34691A46D25'";
        dateFilterStringForSpecificYearItem = "Date eq null and ContentTypeId ne '0x012000532D570857F0FA419A99D34691A46D25'";
      }
      pnp.sp.web.lists.getByTitle('Depenses').items.filter(dateFilterStringForSpecificYearDoc).top(5000).inBatch(batch).get().then(async(res: any) => {
        this.createObjectForDepensesDoc(res);
      });
      pnp.sp.web.lists.getByTitle('D%C3%A9penses').items.filter(dateFilterStringForSpecificYearItem).top(5000).inBatch(batch).get().then(async(res: any) => {
        this.createObjectForDepensesItem(res);
      });
    } else {
      pnp.sp.web.lists.getByTitle('Depenses').items.top(5000).inBatch(batch).get().then(async(res: any) => {
        this.createObjectForDepensesDoc(res);
      });
      _.each(this.expenses,);
      pnp.sp.web.lists.getByTitle('D%C3%A9penses').items.top(5000).inBatch(batch).get().then(async(res: any) => {
        this.createObjectForDepensesItem(res);
      });
    }
    pnp.sp.site.rootWeb.lists.getByTitle('Fournisseurs').items.top(5000).inBatch(batch).get().then(async(res: any) => {
      res.forEach(item => {
        let x:any = {};
        x.id = item.Id;
        x.title = item.Title;
        this.providers.push(x);
      });
    });
    pnp.sp.site.rootWeb.lists.getByTitle('TaxonomyHiddenList').items.top(5000).inBatch(batch).get().then(async(res: any) => {
      res.forEach(item => {
        let x:any = {};
        x.id = item.Id;
        x.path1033 = item.Path1033;
        x.path1036 = item.Path1036;
        x.term1033 = item.Term1033;
        x.term1036 = item.Term1036;
        this.taxonomyHiddenListItems.push(x);
      });
    });

    await batch.execute();

    _.map(this.expenses, (expenseItem:IExpense) => {
      let taxoItemFiltered = _.filter(this.taxonomyHiddenListItems, (taxoItem) => {
        return taxoItem.id == expenseItem.flatId;
      });
      if (taxoItemFiltered.length > 0) {
        expenseItem.flat = taxoItemFiltered[0].term1036;
      }
    });
    _.map(this.expenses, (expenseItem:IExpense) => {
      let taxoItemFiltered = _.filter(this.taxonomyHiddenListItems, (taxoItem) => {
        return taxoItem.id == expenseItem.taxCategoryId;
      });
      if (taxoItemFiltered.length > 0) {
        expenseItem.taxCategory = taxoItemFiltered[0].term1036;
      }
    });
    _.map(this.expenses, (expenseItem:IExpense) => {
      let providerItemFiltered = _.filter(this.providers, (providerItem) => {
        return providerItem.id == expenseItem.providerId;
      });
      if (providerItemFiltered.length > 0) {
        expenseItem.provider = providerItemFiltered[0].title;
      }
    });

    console.log(this.expenses);
    return this.expenses;
  }

  public createObjectForDepensesDoc(res: any) {
    console.log('expensesService - createObjectForDepensesDoc');
    res.forEach((item) => {
      let x:any = {};
      x.type = 'Document';
      x.price = item.Prix;
      x.validated = item.Valide;
      x.id = item.Id;
      x.created = item.Created;
      x.modified = item.Modified;
      if (item.Date1 != null) {
        x.date = new Date(item.Date1); //.format('yyyy-MM-dd');
      }
      x.authorId = item.AuthorId;
      x.providerId = parseInt(item.FournisseursId);
      x.title = item.Title;
      x.manager = item.GestionnairesChoice;
      x.p = item.P;
      x.relativeEditLink = this.webUrl + '/Depenses/Forms/EditForm.aspx?ID=' + item.Id + '&Source=' + window.location.href;
      if (x.date != undefined) {
        x.year = 0; //parseInt(x.date.substr(0, 4));  TODO corriger year
      }
      if (item.Logements) {
        x.flatId = parseInt(item.Logements.Label);
      }
      if (item.TaxesCategory) {
        x.taxCategoryId = parseInt(item.TaxesCategory.Label);
      }
      this.expenses.push(x);
    });
  }
  public createObjectForDepensesItem(res: any) {
    console.log('expensesService - createObjectForDepensesItem');
    res.forEach(item => {
      let x:any = {};
      x.type = 'item';
      x.price = item.Montant;
      x.validated = item.Valid_x00e9_;
      x.id = item.Id;
      x.created = item.Created;
      x.modified = item.Modified;
      x.date = item.Date;
      x.authorId = parseInt(item.AuthorId);
      x.providerId = item.FournisseursId;
      x.title = item.Title;
      x.manager = item.GestionnairesChoice;
      x.p = item.P;
      x.relativeEditLink = this.webUrl + '/Lists/depenses/EditForm.aspx?ID=' + item.Id + '&Source=' + window.location.href;
      if (x.date != undefined) {
        x.year = 0; // parseInt(x.date.substr(0, 4)); TODO corriger year
      }
      if (item.Logements) {
        x.flatId = parseInt(item.Logements.Label);
      }
      if (item.TaxesCategory) {
        x.taxCategoryId = parseInt(item.TaxesCategory.Label);
      }
      this.expenses.push(x);

    });
  }

}
