import * as React from 'react';
import {DetailsList, MarqueeSelection, Panel, PanelType, Spinner, SpinnerSize} from "office-ui-fabric-react";
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import {IExpense} from "../../../models/IExpense";
import * as _ from 'lodash';
import {IColumn, Selection} from "office-ui-fabric-react/lib/DetailsList";
import * as strings from "ImmodmmmAdminAppWebPartStrings";
import {IImmodmmmAdminAppProps} from "./IImmodmmmAdminAppProps";
import EditExpense from "./editExpense";
import {IExpensesService} from "../../../../lib/models/IExpensesService";
import { IWebPartContext } from "@microsoft/sp-webpart-base/lib";



export interface IExpenseGridProps {
  expensesFiltered:IExpense[];
  isLoading:boolean;
  parentToggle?:any;
  expensesService:IExpensesService;
  context: IWebPartContext;
}

export interface IExpenseGridState {
  columns?: IColumn[];
  selectionDetails?: {};
  isModalSelection?: boolean;
  isCompactMode?: boolean;
  expensesSorted?:IExpense[];
  editPanelShow?:boolean;
  editPanelItem?:IExpense;
}
let _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Titre',
    fieldName: 'title',
    minWidth: 40,
    maxWidth: 100,
    isResizable: true,
    onColumnClick: this._onColumnClick,
    data:'string',
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column2',
    name: 'Prix',
    fieldName: 'price',
    minWidth: 40,
    maxWidth: 100,
    isResizable: true,
    onColumnClick: this._onColumnClick,
    data: 'number',
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column3',
    name: 'Date',
    fieldName: 'dateValue',
    minWidth: 40,
    maxWidth: 100,
    isResizable: true,
    isSorted: true,
    isSortedDescending: false,
    onRender: (item: IExpense) => {
      return (
        <span>
              { item.dateFormatted }
        </span>
      );
    },
    onColumnClick: this._onColumnClick,
    data: 'number',
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column4',
    name: 'Catégorie de taxe',
    fieldName: 'taxCategory',
    minWidth: 40,
    maxWidth: 100,
    isResizable: true,
    onColumnClick: this._onColumnClick,
    data:'string',
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column5',
    name: 'Gestionnaire',
    fieldName: 'manager',
    minWidth: 40,
    maxWidth: 100,
    isResizable: true,
    onColumnClick: this._onColumnClick,
    data: 'string',
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column6',
    name: 'Valide ?',
    fieldName: 'validated',
    minWidth: 40,
    maxWidth: 100,
    isResizable: true,
    onColumnClick: this._onColumnClick,
    data: 'boolean',
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column7',
    name: 'Fournisseur',
    fieldName: 'providerId',
    minWidth: 40,
    maxWidth: 100,
    isResizable: true,
    onColumnClick: this._onColumnClick,
    data: 'string',
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column7',
    name: 'Logement',
    fieldName: 'flat',
    minWidth: 40,
    maxWidth: 100,
    isResizable: true,
    onColumnClick: this._onColumnClick,
    data: 'string',
    ariaLabel: 'Operations for name'
  }
];

export default class ExpensesGrid extends React.Component<IExpenseGridProps, IExpenseGridState> {
  private _selection: Selection;

  constructor(props: IExpenseGridProps) {
    console.log('..ExpensesGrid - Constructor - start');
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectionDetails: this._getSelectionDetails(),
          //isModalSelection: this._selection.isModal()
        });
      }
    });
    this.state = {
      columns: _columns,
      expensesSorted: this.props.expensesFiltered,
      editPanelShow: false
    };
  }

  public doParentToggle(){
    console.log("doParentToggle");
  }

  public render(): React.ReactElement<IExpenseGridProps> {
    console.log('..ExpensesGrid - render');
    let myCallback = (dataFromChild) => {
      console.log(dataFromChild);
      this.setState({
        editPanelShow : false
        });
    };


    let renderGrid: JSX.Element = null;
    let renderSpinner: JSX.Element = null;

    if(this.props.isLoading == false && this.props.expensesFiltered.length === 0){
      renderGrid = <div>No Items to show</div>;
    }
    if(this.props.isLoading == false && this.props.expensesFiltered.length > 0){
      renderGrid = <DetailsList
        items={ this.props.expensesFiltered }
        columns={ _columns }
        isHeaderVisible={ true }
        selection={ this._selection }
        selectionPreservedOnEmptyClick={ true }
        onItemInvoked={ this._onItemInvoked }
      />;
    }
    if(this.props.isLoading){
      renderSpinner = <Spinner size={ SpinnerSize.large } />;
    }else{
      renderSpinner = <div></div>;
    }

    return (
      <div>
        <MarqueeSelection selection={ this._selection }>
        { renderSpinner }
        { renderGrid }
        </MarqueeSelection>

        <EditExpense showPanel={this.state.editPanelShow} expense={this.state.editPanelItem} parentToggle={this.doParentToggle} expensesService = {this.props.expensesService} onPanelDismiss={() => this.setState({editPanelShow:false})} context = {this.props.context  as IWebPartContext}/>
      </div>
    );
  }
  @autobind
  private _onItemInvoked(expense:IExpense){
    console.log('onItemInvoked');
    console.log(expense);
    this.setState({ editPanelShow: true, editPanelItem:expense });
  }

  @autobind
  private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
    const { columns, expensesSorted } = this.state;
    let newItems: IExpense[] = expensesSorted.slice();
    let newColumns: IColumn[] = columns.slice();
    let currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
      return column.key === currCol.key;
    })[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    newItems = this._sortItems(newItems, currColumn.fieldName, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      expensesSorted: newItems
    });
  }
  @autobind
  private _sortItems(items: IExpense[], sortBy: string, descending = false): IExpense[] {
    if (descending) {
      return items.sort((a: IExpense, b: IExpense) => {
        if (a[sortBy] < b[sortBy]) {
          return 1;
        }
        if (a[sortBy] > b[sortBy]) {
          return -1;
        }
        return 0;
      });
    } else {
      return items.sort((a: IExpense, b: IExpense) => {
        if (a[sortBy] < b[sortBy]) {
          return -1;
        }
        if (a[sortBy] > b[sortBy]) {
          return 1;
        }
        return 0;
      });
    }
  }

  private _getSelectionDetails(): string {
    let selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as any).name;
      default:
        return `${selectionCount} items selected`;
    }
  }
}
