import * as React from 'react';
import {IExpense} from "../../../models/IExpense";
import * as _ from 'lodash';
import {IAppContainerProps} from "./appContainer";
import {TaxesCategory} from "../../../models/ITaxesCategory";
import {Revenu} from "../../../models/IRevenu";
import {IExpensesService} from "../../../models/IExpensesService";
import {Transaction} from "../../../models/ITransaction";

export interface ITaxesProps {
  expensesFiltered: IExpense[];
  isLoading: boolean;
  expensesService: IExpensesService;
  year:number;
}

export interface ITaxesState {
  revenues?: Revenu[];
  transactions?:Transaction[];
}

export default class Taxes extends React.Component<ITaxesProps, ITaxesState> {
  private expenses: IExpense[];

  private taxeCategories?: TaxesCategory[];

  private percentageHousePersonalMerlin: number = 0.333333;
  private percentageHousePersonalDenise: number = 0;
  private totalExpenses: number = 0;
  private totalExpensesPersonelMM: number = 0;
  private totalExpensesPersonelDM: number = 0;
  private totalExpensesWithOutPersonelMM: number = 0;
  private totalExpensesWithOutPersonelDM: number = 0;
  private enpenseWithoutFlat: boolean = false;
  private totalRevenu: number = 0;
  private totalRevenuWithout1821: number = 0;
  private inProgress: boolean = false;
  private interest: number;

  constructor(props: ITaxesProps) {
    super(props);
    console.log('..ExpensesGrid - Constructor - start');
    this.expenses = [];
    this.state = {
      revenues :[],
      transactions :[]
    };


    //props.expensesService.getTaxCategories().then(data => {

      this.taxeCategories= props.expensesService.getTaxCategories();

    //});

  }

  private calculatedSumPerTaxCategory(expenses: IExpense[]) {
    console.log('calculatedSumPerTaxCategory - taxeCategories');
    console.log(this.taxeCategories);
    _.each(this.taxeCategories, (taxeCategory) => {
      if (taxeCategory.taxeCategory) { // Ensure it doesn't calculated null items
        taxeCategory.sum = this.getSumFromTaxId(this.expenses, taxeCategory.taxeCategory);
        taxeCategory.percentagePersonalDM = this.getPersonalSumFromTaxId(this.expenses, taxeCategory.taxeCategory, this.percentageHousePersonalDenise)[0];
        taxeCategory.sumPersonalDM = this.getPersonalSumFromTaxId(this.expenses, taxeCategory.taxeCategory, this.percentageHousePersonalDenise)[1];
        taxeCategory.percentagePersonalMM = this.getPersonalSumFromTaxId(this.expenses, taxeCategory.taxeCategory, this.percentageHousePersonalMerlin)[0];
        taxeCategory.sumPersonalMM = this.getPersonalSumFromTaxId(this.expenses, taxeCategory.taxeCategory, this.percentageHousePersonalMerlin)[1];
      }
      if (taxeCategory.number === 8710) { // AKA Interest
        taxeCategory.sum = this.interest;
        taxeCategory.percentagePersonalDM = this.percentageHousePersonalDenise;
        taxeCategory.sumPersonalDM = this.interest * this.percentageHousePersonalDenise;
        taxeCategory.percentagePersonalMM = this.percentageHousePersonalMerlin;
        taxeCategory.sumPersonalMM = this.interest * this.percentageHousePersonalMerlin;
      }
    });
  }

  private getSumFromTaxId(expenses: IExpense[], taxCategoryId: number) {
    return _(expenses)
      .filter((expense: IExpense) => {
        return expense.taxCategoryId.WssId === taxCategoryId;
      })
      .reduce((sum, expense: IExpense) => {
        return sum + expense.price;
      }, 0);
  }

  private getPersonalSumFromTaxId(expenses: IExpense[], taxCategoryId: number, percentage) {
    let expensesInCategory = _(expenses)
      .filter((expense: IExpense) => {
        return expense.taxCategoryId.WssId === taxCategoryId;
      })
      .value();
    if (percentage !== 0) {
      // AKA, Merlin qui a 33% en perso
      if (taxCategoryId === 21) {
        // AKA entretien et réparation
        /*
         1e Étage = FlatID 15
         2e Étage = FlatID 12
         3e Étage = FlatID 13
         Global = FlatID 14
         */
        let expense1e = _(expensesInCategory)
          .filter((expense: IExpense) => {
            return expense.flatId.WssId === 15;
          })
          .reduce((sum, expense: IExpense) => {
            return sum + expense.price;
          }, 0);
        let expense2e = _(expensesInCategory)
          .filter((expense: IExpense) => {
            return expense.flatId.WssId === 12;
          })
          .reduce((sum, expense: IExpense) => {
            return sum + expense.price;
          }, 0);
        let expense3e = _(expensesInCategory)
          .filter((expense: IExpense) => {
            return expense.flatId.WssId === 13;
          })
          .reduce((sum, expense: IExpense) => {
            return sum + expense.price;
          }, 0);
        let expenseGlobal = _(expensesInCategory)
          .filter((expense: IExpense) => {
            return expense.flatId.WssId === 14;
          })
          .reduce((sum, expense: IExpense) => {
            return sum + expense.price;
          }, 0);
        let expenseWithOutFlat = _(expensesInCategory)
          .filter((expense: IExpense) => {
            return !expense.flatId;
          })
          .value();
        if (expenseWithOutFlat.length > 0) {
          this.enpenseWithoutFlat = true;
        } else {
          this.enpenseWithoutFlat = false;
        }

        return [(expense1e + (expenseGlobal * this.percentageHousePersonalMerlin)) / (expense1e + expense2e + expense3e + expenseGlobal), expense1e + (expenseGlobal * this.percentageHousePersonalMerlin)];
      } else {
        // tous les autres cat impôt.
        let x = _(expensesInCategory)
          .reduce((sum, expense: IExpense) => {
            return sum + expense.price;
          }, 0);
        return [percentage, x * percentage];
      }
    } else {
      // AKA, denise, qui a 0 % perso
      return [0, 0]; // TODO, faire le vrai calcul !
    }
  }

  private calculateSums() {
    this.totalExpenses = _.reduce(this.taxeCategories, (sum: number, taxCategory) => {
      return sum + taxCategory.sum;
    }, 0);
    this.totalExpensesPersonelDM = _.reduce(this.taxeCategories, (sum: number, taxCategory) => {
      return sum + taxCategory.sumPersonalDM;
    }, 0);


    this.totalExpensesPersonelMM = _.reduce(this.taxeCategories, (sum: number, taxCategory) => {
      return sum + taxCategory.sumPersonalMM;
    }, 0);
    this.totalExpensesWithOutPersonelDM = this.totalExpenses - this.totalExpensesPersonelDM;
    this.totalExpensesWithOutPersonelMM = this.totalExpenses - this.totalExpensesPersonelMM;
  }


  public async componentDidMount(){
    this.setState({
      revenues: await this.props.expensesService.getRevenues(this.props.year),
      transactions: await this.props.expensesService.getTransactionCompte(this.props.year)
    });

  }

  public render(): React.ReactElement<IAppContainerProps> {
    console.log('taxes - render');
    console.log(this.props.expensesFiltered);
    console.log(this.state.revenues);
    this.inProgress = true;


    this.totalRevenu = _.reduce(this.state.revenues, (sum, revenu: Revenu) => {
      return sum + revenu.r1821 + revenu.r1823 + revenu.r1825;
    }, 0);
    this.totalRevenuWithout1821 = _.reduce(this.state.revenues, (sum, revenu: Revenu) => {
      return sum + revenu.r1823 + revenu.r1825;
    }, 0);

    this.interest = _(this.state.transactions)
      .filter((transaction: Transaction) => {
        return transaction.accountType.indexOf('PR') != -1;
      })
      .reduce((sum, transaction: Transaction) => {
        return sum + transaction.interest;
      }, 0);

    this.calculatedSumPerTaxCategory(this.props.expensesFiltered);
    this.calculateSums();
    this.inProgress = false;



    let renderTable: JSX.Element[] = this.taxeCategories.map((tc)=> {
      return <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm2">{tc.title}</div>
        <div className="ms-Grid-col ms-sm2 taxCategory">{tc.number}</div>
        <div className="ms-Grid-col ms-sm2">{tc.sum.toFixed(2)}</div>
        <div className="ms-Grid-col ms-sm2">{tc.percentagePersonalDM.toFixed(2)}</div>
        <div className="ms-Grid-col ms-sm2">{tc.sumPersonalDM.toFixed(2)}</div>
        <div className="ms-Grid-col ms-sm2">{tc.percentagePersonalMM.toFixed(2)}</div>
        <div className="ms-Grid-col ms-sm2">{tc.sumPersonalMM.toFixed(2)}</div>
      </div>;
    });

    return (

      <div>

        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm2">Titre</div>
            <div className="ms-Grid-col ms-sm2"># taxe catégorie</div>
            <div className="ms-Grid-col ms-sm2">Dépenses totales</div>
            <div className="ms-Grid-col ms-sm2">% personnel DM</div>
            <div className="ms-Grid-col ms-sm2">Partie personnel DM</div>
            <div className="ms-Grid-col ms-sm2">% personnel MM</div>
            <div className="ms-Grid-col ms-sm2">Partie personnel MM</div>
          </div>

          {renderTable}

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm2">Totaux</div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div className="ms-Grid-col ms-sm2">{this.totalExpenses.toFixed(2)}</div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div className="ms-Grid-col ms-sm2">{this.totalExpensesPersonelDM.toFixed(2)}</div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div className="ms-Grid-col ms-sm2">{this.totalExpensesPersonelMM.toFixed(2)}</div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm2">Total moins partie personnel</div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div className="ms-Grid-col ms-sm2">{this.totalExpensesWithOutPersonelDM.toFixed(2)}</div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div className="ms-Grid-col ms-sm2">{this.totalExpensesWithOutPersonelMM.toFixed(2)}</div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm2">Ajout sur le revenue personnel (sans 1821)</div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div
              className="ms-Grid-col ms-sm2">{(Number(this.totalRevenuWithout1821.toFixed(2)) / 2) - Number(this.totalExpensesWithOutPersonelDM.toFixed(2))}</div>
            <div className="ms-Grid-col ms-sm2"></div>
            <div
              className="ms-Grid-col ms-sm2">{(Number(this.totalRevenuWithout1821.toFixed(2)) / 2) - Number(this.totalExpensesWithOutPersonelMM.toFixed(2))}</div>
          </div>
        </div>
        <div className="Warning">ATTENTION : il y a des dépenses qui n'ont pas de logement !</div>
        <h2>Nombre d'items considéré : {this.expenses.length}</h2>
        <h1>Revenue</h1>
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6">Revenue total :</div>
            <div className="ms-Grid-col ms-sm6">{this.totalRevenu}</div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6">Revenu total sans 1821 :</div>
            <div className="ms-Grid-col ms-sm6">{this.totalRevenuWithout1821}</div>
          </div>
        </div>

      </div>
    );
  }

}
