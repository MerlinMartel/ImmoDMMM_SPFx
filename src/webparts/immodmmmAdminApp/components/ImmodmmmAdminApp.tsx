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
import {IWebPartContext} from "@microsoft/sp-webpart-base/lib";


export interface IImmodmmmAdminAppState {
  columns?: IColumn[];
  selectionDetails?: {};
  isModalSelection?: boolean;
  isCompactMode?: boolean;
  selectedItem?: { key: string | number | undefined };
}


export default class ImmodmmmAdminApp extends React.Component<IImmodmmmAdminAppProps, IImmodmmmAdminAppState> {
  constructor(props: IImmodmmmAdminAppProps) {
    //console.log('.ImmodmmmAdminAdd - Constructor - start');
    super(props);
  }

  public render(): React.ReactElement<IImmodmmmAdminAppProps> {
    //console.log('.ImmodmmmAdminApp - render');
    return (
      <div>
        <AppContainer expensesService={this.props.expensesService} context={this.props.context as IWebPartContext}/>
      </div>
    );
  }


  public componentDidUpdate(previousProps: any, previousState: IImmodmmmAdminAppState) {
    //console.log('.ImmodmmmAdminApp - componentDidUpdate');
  }
}
