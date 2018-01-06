import * as React from 'react';
import {Dropdown, IDropdownOption, Label, Pivot, PivotLinkFormat} from "office-ui-fabric-react";
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import {IExpense} from "../../../models/IExpense";
import * as _ from 'lodash';
import ExpensesGrid from "./expensesGrid";
import {PivotItem} from "office-ui-fabric-react/lib/components/Pivot/PivotItem";

export interface IAppContainerProps {
  expenses:IExpense[];
  isLoading:boolean;
}

export interface IAppContainerState {
  expensesFiltered?:IExpense[];
  selectedYear?: IDropdownOptionCustom;
}
export interface IDropdownOptionCustom{
  key:number;
  text:string;
}

export default class AppContainer extends React.Component<IAppContainerProps, IAppContainerState> {

  constructor(props: IAppContainerProps) {
    console.log('.appContainer - Constructor - start');
    super(props);
    let currentYear = new Date().getFullYear();
    let currentYearString = currentYear.toString();

    this.state = {
      selectedYear: {key: currentYear, text: currentYearString},
      expensesFiltered: []
    };
  }


  public render(): React.ReactElement<IAppContainerProps> {
    console.log('.appContainer - render');
    console.log('this.props.expenses');
    console.log(this.props.expenses);
    console.log('this.state.expensesFiltered');
    console.log(this.state.expensesFiltered);
    let expensesFiltered =  _.filter(this.props.expenses, (e:IExpense) => {
      return e.year == this.state.selectedYear.key;
    });



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
            <ExpensesGrid expensesFiltered={ expensesFiltered } isLoading={this.props.isLoading}/>
          </PivotItem>
          <PivotItem linkText='Import'>
            <br/>
            <Label>Impot</Label>
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
  public changeYearState(item:IDropdownOptionCustom) {

    console.log('here is the things updating...' + item.key + ' ' + item.text);

    this.filterExpensesByYear(this.props.expenses,item.key);
    this.setState({
      selectedYear: item,
    });
  }

  private filterExpensesByYear(expenses:IExpense[], year:number){
    let yearNumber = Number(year);
    let expensesFiltered =  _.filter(expenses, (e:IExpense) => {
      return e.year == yearNumber;
    });
    this.setState({
      expensesFiltered : expensesFiltered
    });
  }
  public componentWillReceiveProps(){
    console.log('.appContainer - componentWillReceiveProps');

  }
  public componentDidReceiveProps(){
    console.log('.appContainer - componentDidReceiveProps');

  }
  public componentDidUpdate(){
    console.log('.appContainer - componentDidUpdate');
  }
}
