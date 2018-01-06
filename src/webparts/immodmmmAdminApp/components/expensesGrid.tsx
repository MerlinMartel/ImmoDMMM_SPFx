import * as React from 'react';
import {DetailsList, MarqueeSelection, Spinner, SpinnerSize} from "office-ui-fabric-react";
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import {IExpense} from "../../../models/IExpense";
import * as _ from 'lodash';
import {IColumn, Selection} from "office-ui-fabric-react/lib/DetailsList";
import * as strings from "ImmodmmmAdminAppWebPartStrings";
import {IImmodmmmAdminAppProps} from "./IImmodmmmAdminAppProps";

export interface IExpenseGridProps {
  expensesFiltered:IExpense[];
  isLoading:boolean;
}

export interface IExpenseGridState {
  columns?: IColumn[];
  selectionDetails?: {};
  isModalSelection?: boolean;
  isCompactMode?: boolean;
  expensesSorted?:IExpense[];
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
      expensesSorted: this.props.expensesFiltered
    };
  }

  public render(): React.ReactElement<IExpenseGridProps> {
    console.log('..ExpensesGrid - render');
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
      </div>
    );
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
