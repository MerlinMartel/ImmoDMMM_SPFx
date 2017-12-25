import * as React from 'react';
import styles from './ImmodmmmAdminApp.module.scss';
import { IImmodmmmAdminAppProps } from './IImmodmmmAdminAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {IExpense} from "../../../models/IExpense";
import * as strings from 'ImmodmmmAdminAppWebPartStrings';
import {DetailsListLayoutMode, IColumn} from "office-ui-fabric-react";
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import {DetailsList, Selection} from "office-ui-fabric-react/lib/DetailsList";
import {TextField} from "office-ui-fabric-react/lib/TextField";
import {MarqueeSelection} from "office-ui-fabric-react/lib/MarqueeSelection";

let _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'title',
    fieldName: 'title',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column2',
    name: 'price',
    fieldName: 'price',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column2',
    name: 'validated',
    fieldName: 'validated',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column2',
    name: 'manager',
    fieldName: 'manager',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column2',
    name: 'provider',
    fieldName: 'provider',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column2',
    name: 'flat',
    fieldName: 'flat',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },
  {
    key: 'column2',
    name: 'taxCategory',
    fieldName: 'taxCategory',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  },


];


export interface IImmodmmmAdminAppState {
  results?: IExpense[];
  loaded?: boolean;
  error?: string;
  items?: {}[];
  selectionDetails?: {};
}


export default class ImmodmmmAdminApp extends React.Component<IImmodmmmAdminAppProps, IImmodmmmAdminAppState> {


  private _selection: Selection;
  constructor(props: IImmodmmmAdminAppProps) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
    });

    this.state = {
      selectionDetails: this._getSelectionDetails()
    };
  }

  public componentDidMount() {
    this.getData(this.props, true);
  }
  private async getData(props: IImmodmmmAdminAppProps, first: boolean) {
    console.log('ImmodmmmAdminApp - getData');
    try {
      let r = await props.expensesService.getExpenses();

      this.setState({
        results: r,
        loaded: true,
        error: null
      });
    } catch (reason) {
      let { message } = reason;
      this.setState({
        error: message || strings.UnexpectedErrorMessage,
        results: [],
        loaded: true
      });
      throw reason;
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

  @autobind
  private _onChanged(text: any): void {
    this.setState({ items: text ? this.state.results.filter(i => i.title.toLowerCase().indexOf(text) > -1) : this.state.results });
  }

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }



  public render(): React.ReactElement<IImmodmmmAdminAppProps> {
    console.log('ImmodmmmAdminApp - render');
    //console.log(this.state.results);
    return (
      <div>
        <div>{ this.state.selectionDetails }</div>
        <TextField
          label='Filter by name:'
          onChanged={ this._onChanged }
        />
        <MarqueeSelection selection={ this._selection }>
          <DetailsList
            items={ this.state.results }
            columns={ _columns }
            setKey='set'
            layoutMode={ DetailsListLayoutMode.fixedColumns }
            selection={ this._selection }
            selectionPreservedOnEmptyClick={ true }
            ariaLabelForSelectionColumn='Toggle selection'
            ariaLabelForSelectAllCheckbox='Toggle selection for all items'
            onItemInvoked={ this._onItemInvoked }
          />
        </MarqueeSelection>
      </div>
    );
  }
}
