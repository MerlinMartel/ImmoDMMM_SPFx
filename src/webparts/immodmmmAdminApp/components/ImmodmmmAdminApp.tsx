import * as React from 'react';
import styles from './ImmodmmmAdminApp.module.scss';
import { IImmodmmmAdminAppProps } from './IImmodmmmAdminAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {IExpense} from "../../../models/IExpense";
import * as strings from 'ImmodmmmAdminAppWebPartStrings';
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import {TextField} from "office-ui-fabric-react/lib/TextField";
import {MarqueeSelection} from "office-ui-fabric-react/lib/MarqueeSelection";
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

let _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'title',
    fieldName: 'title',
    minWidth: 40,
    maxWidth: 100,
    isResizable: true,
    onColumnClick: this._onColumnClick,
    data:'string',
    ariaLabel: 'Operations for name'
  }
];


export interface IImmodmmmAdminAppState {
  loaded?: boolean;
  error?: string;
  items?: any;
  columns?: IColumn[];
  selectionDetails?: {};
  isModalSelection?: boolean;
  isCompactMode?: boolean;
}


export default class ImmodmmmAdminApp extends React.Component<IImmodmmmAdminAppProps, IImmodmmmAdminAppState> {


  private _selection: Selection;
  constructor(props: IImmodmmmAdminAppProps) {
    console.log('.ImmodmmmAdminAdd - Constructor - start');
    super(props);

    this.state = {
      columns: _columns
    };
    console.log('.ImmodmmmAdminAdd - Constructor - end');
  }


  private async getData(props: IImmodmmmAdminAppProps, first: boolean) {
    console.log('.ImmodmmmAdminApp - getData - begin');
    try {
      let r = await props.expensesService.getExpenses();
      const mockdata2 = [{
        "title": "titre",
      }];
      this.setState({
        items: mockdata2,
        loaded: true,
        error: null
      });
    } catch (reason) {
      let { message } = reason;
      this.setState({
        error: message || strings.UnexpectedErrorMessage,
        items: [],
        loaded: true
      });
      throw reason;
    }
    console.log('.ImmodmmmAdminApp - getData - end');
  }




  public render(): React.ReactElement<IImmodmmmAdminAppProps> {
    console.log('.ImmodmmmAdminApp - render');
    console.log(this.state.items);
    return (
      <div>

          <DetailsList
            items={ this.state.items }
          />

      </div>
    );
  }
  public componentDidMount() {
    console.log('.ImmodmmmAdminApp - componentDidMount');
    this.getData(this.props, true);
  }
  public componentDidUpdate(previousProps: any, previousState: IImmodmmmAdminAppState) {
    console.log('.ImmodmmmAdminApp - componentDidUpdate');
  }
}
