import * as React from 'react';
import {MarqueeSelection, Spinner, SpinnerSize} from "office-ui-fabric-react";
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import {IExpense} from "../../../models/IExpense";
import {
  CheckboxVisibility,
  ColumnActionsMode,
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode as LayoutMode,
  IColumn,
  IGroup,
  Selection,
  SelectionMode,
  buildColumns
} from 'office-ui-fabric-react/lib/DetailsList';
import EditExpense from "./editExpense";
import {IExpensesService} from "../../../../lib/models/IExpensesService";
import { IWebPartContext } from "@microsoft/sp-webpart-base/lib";
import * as _ from "lodash"

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
    isSortedDescending: true,
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
    ariaLabel: 'Operations for name',
    onRender: (item: IExpense) => {
      if(item.validated){
        return (
          <i className="ms-Icon ms-Icon--SkypeCircleCheck" aria-hidden="true"></i>
        );
      }

    },
  },
  {
    key: 'column7',
    name: 'Fournisseur',
    fieldName: 'providerLabel',
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
    //console.log('..ExpensesGrid - Constructor - start');
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectionDetails: this._getSelectionDetails(),
        });
      }
    });
    this.state = {
      columns: _columns,
      expensesSorted: this.props.expensesFiltered,
      editPanelShow: false
    };
  }
  public componentWillReceiveProps(nextProps){
    this.state = {
      columns: _columns,
      expensesSorted: nextProps.expensesFiltered,
      editPanelShow: false
    };
  }

  public render(): React.ReactElement<IExpenseGridProps> {
    //console.log('..ExpensesGrid - render');
    let myCallback = (dataFromChild) => {
      console.log(dataFromChild);
      this.setState({
        editPanelShow : false
        });
    };

    let renderGrid: JSX.Element = null;
    let renderSpinner: JSX.Element = null;
    let editExpense: JSX.Element = null;

    if(this.props.isLoading == false && this.state.expensesSorted.length === 0){
      renderGrid = <div>No Items to show</div>;
    }
    if(this.props.isLoading == false && this.state.expensesSorted.length > 0){
      renderGrid = <DetailsList
        items={ this.state.expensesSorted }
        columns={ _columns }
        isHeaderVisible={ true }
        selection={ this._selection }
        selectionPreservedOnEmptyClick={ true }
        onItemInvoked={ this._onItemInvoked }
        onColumnHeaderClick={this._onColumnHeaderClick.bind(this)}
      />;
    }
    if(this.props.isLoading){
      renderSpinner = <Spinner size={ SpinnerSize.large } />;
    }else{
      renderSpinner = <div></div>;
    }
    if (this.state.editPanelShow && this.state.editPanelItem){
      editExpense = <EditExpense showPanel={this.state.editPanelShow} expense={this.state.editPanelItem} expensesService = {this.props.expensesService} onPanelDismiss={() => this.setState({editPanelShow:false})} context = {this.props.context  as IWebPartContext}/>
    }else{
      editExpense = null;
    }


    return (
      <div>
        <MarqueeSelection selection={ this._selection }>
        { renderSpinner }
        { renderGrid }
        </MarqueeSelection>

        {editExpense}
      </div>
    );
  }

  @autobind
  private _onItemInvoked(expense:IExpense){
    //console.log('onItemInvoked');

    this.setState({ editPanelShow: true, editPanelItem:expense });
  }

  @autobind
  private _onColumnHeaderClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
    //console.log("..ExpensesGrid - _onColumnClick");
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
    let sortString:string;
    descending ? sortString = "desc" : sortString = "asc";
    return _.orderBy(items, (x)=> {return x[sortBy]}, sortString)
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
