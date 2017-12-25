import * as React from 'react';
import * as ReactDom from 'react-dom';
import {EnvironmentType, Environment, Version} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ImmodmmmAdminAppWebPartStrings';
import ImmodmmmAdminApp from './components/ImmodmmmAdminApp';
import { IImmodmmmAdminAppProps } from './components/IImmodmmmAdminAppProps';
import {IExpensesService} from "../../models/IExpensesService";
import {ExpensesService} from "../../services/ExpensesService";
import * as moment from 'moment';

export interface IImmodmmmAdminAppWebPartProps {
  description: string;
}

export default class ImmodmmmAdminAppWebPart extends BaseClientSideWebPart<IImmodmmmAdminAppWebPartProps> {

  private expensesService: IExpensesService;

  public async onInit() {

    switch (Environment.type) {
      case EnvironmentType.ClassicSharePoint:
      case EnvironmentType.SharePoint:
        this.expensesService = new ExpensesService(this.context);
        moment.locale(this.context.pageContext.cultureInfo.currentUICultureName);
        break;

      case EnvironmentType.Local:
      case EnvironmentType.Test:
      default:
        //his.newsService = new NewsServiceMock();
        // Register icons and pull the fonts from the default SharePoint cdn:
        //initializeIcons();
        break;
    }

    await super.onInit();
  }


  public render(): void {
    const element: React.ReactElement<IImmodmmmAdminAppProps > = React.createElement(
      ImmodmmmAdminApp,
      {
        expensesService: this.expensesService,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
