import * as pnp from 'sp-pnp-js';
import {IExpense} from "../models/IExpense";
import {IProvider} from "../models/IProvider";
import {TaxonomyHiddenListItem} from "../models/ITaxonomyHiddenListItem";
import IWebPartContext from "@microsoft/sp-webpart-base/lib/core/IWebPartContext";
import * as _ from 'lodash';
import * as moment from 'moment';
import {TaxesCategory} from "../models/ITaxesCategory";
import {Revenu} from "../models/IRevenu";
import {Transaction} from "../models/ITransaction";
import {Reimbursement} from "../models/IReimbursement";

export class ExpensesService {
  //implements IExpensesService
  private expenses: any;
  private providers: IProvider[];
  private taxonomyHiddenListItems: TaxonomyHiddenListItem[];
  private siteCollUrl: string;
  private webUrl: string;
  private revenues: Revenu[] = [];
  private transactions: Transaction[] = [];
  private reimbursements: Reimbursement[] = [];


  public constructor(spfxContext: IWebPartContext) {

    this.siteCollUrl = `${spfxContext.pageContext.site.absoluteUrl}/`;
    this.webUrl = `${spfxContext.pageContext.web.absoluteUrl}/`;
    pnp.setup({
      spfxContext: spfxContext
    });

  }


  public async getExpenses(year?: number): Promise<IExpense[]> {
    //console.log('ExpensesService - getExpenses');
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
      pnp.sp.web.lists.getByTitle('Depenses').items.filter(dateFilterStringForSpecificYearDoc).top(5000).select('FileLeafRef','Title','AuthorId','Date1','FournisseursId','GUID','GestionnairesChoice','GestionnairesId','Id','Logements','Notes1','P','Prix','RCol','ServerRedirectedEmbedUri','TaxesCategory','Valide').inBatch(batch).get().then(async (res: any) => {
        this.createObjectForDepensesDoc(res);
      });
      pnp.sp.web.lists.getByTitle('D%C3%A9penses').items.filter(dateFilterStringForSpecificYearItem).top(5000).inBatch(batch).get().then(async (res: any) => {
        this.createObjectForDepensesItem(res);
      });
    } else {
      pnp.sp.web.lists.getByTitle('Depenses').items.top(5000).inBatch(batch).get().then(async (res: any) => {
        this.createObjectForDepensesDoc(res);
      });
      _.each(this.expenses,);
      pnp.sp.web.lists.getByTitle('D%C3%A9penses').items.top(5000).inBatch(batch).get().then(async (res: any) => {
        this.createObjectForDepensesItem(res);
      });
    }
    pnp.sp.site.rootWeb.lists.getByTitle('Fournisseurs').items.top(5000).inBatch(batch).usingCaching().get().then(async (res: any) => {
      res.forEach(item => {
        let x: any = {};
        x.id = item.Id;
        x.title = item.Title;
        this.providers.push(x);
      });
    });
    pnp.sp.site.rootWeb.lists.getByTitle('TaxonomyHiddenList').items.top(5000).inBatch(batch).usingCaching().get().then(async (res: any) => {
      res.forEach(item => {
        let x: any = {};
        x.id = item.Id;
        x.path1033 = item.Path1033;
        x.path1036 = item.Path1036;
        x.term1033 = item.Term1033;
        x.term1036 = item.Term1036;
        this.taxonomyHiddenListItems.push(x);
      });
    });

    await batch.execute();

    _.map(this.expenses, (expenseItem: IExpense) => {
      let taxoItemFiltered = _.filter(this.taxonomyHiddenListItems, (taxoItem) => {
        return taxoItem.id == expenseItem.flatId;
      });
      if (taxoItemFiltered.length > 0) {
        expenseItem.flat = taxoItemFiltered[0].term1036;
      }
    });
    _.map(this.expenses, (expenseItem: IExpense) => {
      let taxoItemFiltered = _.filter(this.taxonomyHiddenListItems, (taxoItem) => {
        return taxoItem.id == expenseItem.taxCategoryId;
      });
      if (taxoItemFiltered.length > 0) {
        expenseItem.taxCategory = taxoItemFiltered[0].term1036;
      }
    });
    _.map(this.expenses, (expenseItem: IExpense) => {
      let providerItemFiltered = _.filter(this.providers, (providerItem) => {
        return providerItem.id == expenseItem.providerId;
      });
      if (providerItemFiltered.length > 0) {
        expenseItem.provider = providerItemFiltered[0].title;
      }
    });

    return this.expenses;
  }
  public async saveExpense(expense:any):Promise<any>{
    console.log('saveExpense');
    console.log(expense);
    let id = expense.id;
    let expenseWithOutId:any =_.omit(expense, ['id']);
    let itemUpdated = await pnp.sp.web.lists.getByTitle('Depenses').items.getById(id).update(expenseWithOutId);
    console.log('item updated');
    console.log(itemUpdated);
  }

  private createObjectForDepensesDoc(res: any) {
    //console.log('expensesService - createObjectForDepensesDoc');
    res.forEach((item) => {
      let x: any = {};
      x.type = 'Document';
      x.price = Math.round(item.Prix * 100) / 100;
      x.validated = item.Valide;
      x.id = item.Id;
      x.created = item.Created;
      x.modified = item.Modified;
      if (item.Date1 != null) {
        x.date = item.Date1;
        x.dateFormatted = moment(item.Date1).format('YYYY-MM-DD');
        x.dateValue = new Date(item.Date1);
      }
      x.authorId = item.AuthorId;
      x.providerId = parseInt(item.FournisseursId);
      x.title = item.Title;
      x.manager = item.GestionnairesChoice;
      x.p = item.P;
      x.relativeEditLink = this.webUrl + '/Depenses/Forms/EditForm.aspx?ID=' + item.Id + '&Source=' + window.location.href;
      if (x.dateValue != undefined) {
        x.year = new Date(item.Date1).getFullYear();
      }
      if (item.Logements) {
        x.flatId = parseInt(item.Logements.Label);
      }
      if (item.TaxesCategory) {
        x.taxCategoryId = parseInt(item.TaxesCategory.Label);
      }
      x.ServerRedirectedEmbedUri = item.ServerRedirectedEmbedUri;
      x.FileLeafRef = item.FileLeafRef;
      this.expenses.push(x);
    });
  }

  private createObjectForDepensesItem(res: any) {
    //console.log('expensesService - createObjectForDepensesItem');
    res.forEach(item => {
      let x: any = {};
      x.type = 'item';
      x.price = Math.round(item.Montant * 100) / 100;
      x.validated = item.Valid_x00e9_;
      x.id = item.Id;
      x.created = item.Created;
      x.modified = item.Modified;
      if (item.Date != null) {
        x.date = item.Date;
        x.dateFormatted = moment(item.Date).format('YYYY-MM-DD');
        x.dateValue = new Date(item.Date1);
      }
      x.authorId = parseInt(item.AuthorId);
      x.providerId = item.FournisseursId;
      x.title = item.Title;
      x.manager = item.GestionnairesChoice;
      x.p = item.P;
      x.relativeEditLink = this.webUrl + '/Lists/depenses/EditForm.aspx?ID=' + item.Id + '&Source=' + window.location.href;
      if (x.date != undefined) {
        x.year = new Date(item.Date).getFullYear();
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

  public async getTaxonomyHiddenList() {
    //TODO : valider si c<est necessaire
    var taxonomyHiddenList: [TaxonomyHiddenListItem];
    await pnp.sp.site.rootWeb.lists.getByTitle('TaxonomyHiddenList').items.top(5000).get().then((res: any) => {
      _.each(res, item => {
        let x = new TaxonomyHiddenListItem;
        x.id = item.Id;
        x.path1033 = item.Path1033;
        x.path1036 = item.Path1036;
        x.term1033 = item.Term1033;
        x.term1036 = item.Term1036;
        taxonomyHiddenList.push(x);
      });
    });
    console.log(taxonomyHiddenList);
    return taxonomyHiddenList;
  }

  public getTaxCategories(): TaxesCategory[] {
    //TODO: aucune valeur, devrait simplement etre une constance
    var taxCategories: TaxesCategory[] = [];
    var taxCatRaw = [
      {
        title: 'Publicité',
        number: 8521,
        taxeCategory: 28
      },
      {
        title: 'Assurances',
        number: 8690,
        taxeCategory: 18
      },
      {
        title: 'Intérêts',
        number: 8710
      },
      {
        title: 'Frais de bureau',
        number: 8810,
        taxeCategory: 23
      },
      {
        title: 'Frais comptables, juridiques et autres honoraires',
        number: 8860,
        taxeCategory: 30
      },
      {
        title: "Frais de gestion et d'administration",
        number: 8871,
        taxeCategory: 37
      },
      {
        title: 'Entretien et réparation',
        number: 8960,
        taxeCategory: 21
      },
      {
        title: 'Salaires, traitements et avantages',
        number: 9060,
        taxeCategory: 38
      },
      {
        title: 'Impôt foncier',
        number: 9180,
        taxeCategory: 19
      },
      {
        title: 'Frais de voyage',
        number: 9200,
        taxeCategory: 39
      },
      {
        title: 'Service publics',
        number: 9220,
        taxeCategory: 32
      },
      {
        title: 'Dépenses relatives aux véhicules à moteur',
        number: 9281,
        taxeCategory: 41
      },
      {
        title: 'Autres dépenses',
        number: 9270,
        taxeCategory: 42
      }
    ];
    _.each(taxCatRaw, item => {
      let x = new TaxesCategory;
      x.title = item.title;
      x.number = item.number;
      x.taxeCategory = item.taxeCategory;
      taxCategories.push(x);
    });
    return taxCategories;
  }

  public async getRevenues(year?: number): Promise<Revenu[]> {
    let dateFilterString = "Date gt '" + year + "-01-01T00:00:00Z' and Date lt '" + year + "-12-31T00:00:00Z'";

    this.revenues = [];
    await pnp.sp.web.lists.getByTitle('Revenue (Loyer et autres)').items.filter(dateFilterString).top(5000).get().then((res: any) => {
      _.each(res, item => {
        let x = new Revenu;
        x.id = item.Id;
        x.r1821 = item.revPremier;
        x.r1823 = item.revTroisieme;
        x.r1825 = item.revDeuxieme;
        x.date = item.Date;
        this.revenues.push(x);
      });
    });
    return this.revenues;
  }

  public async getTransactionCompte(year?: number): Promise<Transaction[]> {
    let dateFilterString = "Date gt '" + year + "-01-01T00:00:00Z' and Date lt '" + year + "-12-31T00:00:00Z'";
    this.transactions = [];
    await pnp.sp.web.lists.getByTitle('Transactions Compte Banque').items.filter(dateFilterString).top(5000).get().then((res: any) => {
      _.each(res, item => {
        let x = new Transaction;
        x.id = item.Id;
        x.folio = item.CompteNumero;
        x.accountType = item.CompteType;
        x.date = item.Date;
        x.number = 0;
        x.description = item.Description;
        x.withdrawal = item.Retrait;
        x.deposit = item.Depot;
        x.interest = item.Interet;
        x.refund = item.Remboursement;
        x.balance = item.Solde;
        this.transactions.push(x);
      });
    });
    return this.transactions;
  }

  public async getReimbursement(): Promise<Reimbursement[]> {
    this.reimbursements = [];
    await pnp.sp.web.lists.getByTitle('Remboursement').items.top(5000).get().then((res: any) => {
      _.each(res, item => {
        let x = new Reimbursement();
        x.id = item.Id;
        x.title = item.Title;
        x.date = item.Date;
        x.manager = item.GestionnairesChoice;
        x.type = item.TypeRemboursement;
        x.amount = item.Montant;
        x.year = parseInt(item.Ann_x00e9_e.substring(0, 4)); // TODO : devrait être plus clean
        this.reimbursements.push(x);
      });
    });
    return this.reimbursements;
  }
}
