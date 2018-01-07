import * as React from 'react';
import {Dropdown, IDropdownOption, Label, Pivot, PivotLinkFormat} from "office-ui-fabric-react";
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import {IExpense} from "../../../models/IExpense";
import * as _ from 'lodash';
import ExpensesGrid from "./expensesGrid";
import {PivotItem} from "office-ui-fabric-react/lib/components/Pivot/PivotItem";
import Taxes from "./taxes";
import {IExpensesService} from "../../../models/IExpensesService";
import {IImmodmmmAdminAppProps} from "./IImmodmmmAdminAppProps";
import * as strings from "ImmodmmmAdminAppWebPartStrings";

export interface IAppContainerProps {
  expensesService:IExpensesService;
}

export interface IAppContainerState {
  expensesFiltered?:IExpense[];
  selectedYear?: IDropdownOptionCustom;
  isLoading?: boolean;
  error?: string;
  expenses?: any;
}
export interface IDropdownOptionCustom{
  key:number;
  text:string;
}

export default class AppContainer extends React.Component<IAppContainerProps, IAppContainerState> {

  constructor(props: IAppContainerProps) {
    //console.log('.appContainer - Constructor - start');
    super(props);
    let currentYear = new Date().getFullYear();
    let currentYearString = currentYear.toString();

    this.state = {
      selectedYear: {key: 2016, text: '2016'},
      expensesFiltered: []
    };
  }
  private async getData(props: IImmodmmmAdminAppProps, first: boolean) {
    //console.log('.ImmodmmmAdminApp - getData - begin');
    this.setState({
      isLoading: true
    });
    try {
      let r = await props.expensesService.getExpenses(this.state.selectedYear.key);
      let rSorted = _.orderBy(r, ['dateValue'],['desc']);
      this.setState({
        expensesFiltered: rSorted,
        isLoading: false,
        error: null
      });
    } catch (reason) {
      let { message } = reason;
      this.setState({
        error: message || strings.UnexpectedErrorMessage,
        expensesFiltered: [],
        isLoading: false
      });
      throw reason;
    }
    //console.log(this.state.expensesFiltered);
    //console.log('.ImmodmmmAdminApp - getData - end');
  }

  public componentDidMount() {
    //console.log('.ImmodmmmAdminApp - componentDidMount');
    this.getData(this.props, true);
  }

  public render(): React.ReactElement<IAppContainerProps> {
    //console.log('.appContainer - render');
    //console.log('this.props.expenses');
    //console.log(this.state.expenses);
    //console.log('this.state.expensesFiltered');
    //console.log(this.state.expensesFiltered);
    //let expensesFiltered =  _.filter(this.state.expenses, (e:IExpense) => {
    //  return e.year == this.state.selectedYear.key;
    //});



    return (

      <div >
        <div className="appContainerDropDown">
          <Dropdown
            className='Dropdown-example'
            placeHolder='Select an Option'
            label='Année :'
            id='Basicdrop1'
            ariaLabel='Basic dropdown example'
            selectedKey={ (this.state.selectedYear ? this.state.selectedYear.key : undefined) }
            dropdownWidth={200}

            options={
              [
                { key: 2010, text: '2010' },
                { key: 2012, text: '2012' },
                { key: 2013, text: '2013' },
                { key: 2014, text: '2014' },
                { key: 2015, text: '2015' },
                { key: 2016, text: '2016' },
                { key: 2017, text: '2017' },
                { key: 2018, text: '2018' },
              ]
            }
            onChanged={ this.changeYearState }

          />
        </div>
        <br/>
        <Pivot linkFormat={ PivotLinkFormat.tabs }>
          <PivotItem linkText='Dépenses'>
            <br/>
            <ExpensesGrid expensesFiltered={ this.state.expensesFiltered } isLoading={this.state.isLoading} expensesService = {this.props.expensesService}/>
          </PivotItem>
          <PivotItem linkText='Impot'>
            <br/>
            <Taxes expensesFiltered={this.state.expensesFiltered} isLoading={this.state.isLoading} expensesService={this.props.expensesService} year={this.state.selectedYear.key}/>
          </PivotItem>
          <PivotItem linkText='Remboursement'>
            <br/>
            <Label>Remboursement</Label>
          </PivotItem>
        </Pivot>




      </div>
    );
  }

  @autobind
  public async changeYearState(item:IDropdownOptionCustom) {
    this.setState({
      isLoading: true
    });

    console.log('here is the things updating...' + item.key + ' ' + item.text);
    let r = await this.props.expensesService.getExpenses(item.key);
    this.setState({
      selectedYear: item,
      expensesFiltered: r,
      isLoading: false
    });
  }
}
