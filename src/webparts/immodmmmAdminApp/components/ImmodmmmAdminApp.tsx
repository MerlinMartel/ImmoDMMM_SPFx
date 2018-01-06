import * as React from 'react';
import styles from './ImmodmmmAdminApp.module.scss';
import { IImmodmmmAdminAppProps } from './IImmodmmmAdminAppProps';
import * as strings from 'ImmodmmmAdminAppWebPartStrings';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList';
import * as _ from 'lodash';
import AppContainer from "./appContainer";


export interface IImmodmmmAdminAppState {
  isLoading?: boolean;
  error?: string;
  expenses?: any;
  columns?: IColumn[];
  selectionDetails?: {};
  isModalSelection?: boolean;
  isCompactMode?: boolean;
  selectedItem?: { key: string | number | undefined };
}


export default class ImmodmmmAdminApp extends React.Component<IImmodmmmAdminAppProps, IImmodmmmAdminAppState> {
  constructor(props: IImmodmmmAdminAppProps) {
    console.log('.ImmodmmmAdminAdd - Constructor - start');
    super(props);
    this.state = {
      expenses: [],
      isLoading:false
    };
  }

  public render(): React.ReactElement<IImmodmmmAdminAppProps> {
    console.log('.ImmodmmmAdminApp - render');
    return (
      <div>
        <AppContainer expenses={this.state.expenses} isLoading={this.state.isLoading}/>
      </div>
    );
  }

  private async getData(props: IImmodmmmAdminAppProps, first: boolean) {
    console.log('.ImmodmmmAdminApp - getData - begin');
    this.setState({
      isLoading: true
    });
    try {
      let r = await props.expensesService.getExpenses();
      let rSorted = _.orderBy(r, ['dateValue'],['desc']);
      this.setState({
        expenses: rSorted,
        isLoading: false,
        error: null
      });
    } catch (reason) {
      let { message } = reason;
      this.setState({
        error: message || strings.UnexpectedErrorMessage,
        expenses: [],
        isLoading: false
      });
      throw reason;
    }
    console.log(this.state.expenses);
    console.log('.ImmodmmmAdminApp - getData - end');
  }

  public componentDidMount() {
    console.log('.ImmodmmmAdminApp - componentDidMount');
    this.getData(this.props, true);
  }
  public componentDidUpdate(previousProps: any, previousState: IImmodmmmAdminAppState) {
    console.log('.ImmodmmmAdminApp - componentDidUpdate');
  }
}
