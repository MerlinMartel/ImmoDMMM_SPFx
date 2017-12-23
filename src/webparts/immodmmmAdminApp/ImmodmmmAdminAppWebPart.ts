import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ImmodmmmAdminAppWebPartStrings';
import ImmodmmmAdminApp from './components/ImmodmmmAdminApp';
import { IImmodmmmAdminAppProps } from './components/IImmodmmmAdminAppProps';

export interface IImmodmmmAdminAppWebPartProps {
  description: string;
}

export default class ImmodmmmAdminAppWebPart extends BaseClientSideWebPart<IImmodmmmAdminAppWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IImmodmmmAdminAppProps > = React.createElement(
      ImmodmmmAdminApp,
      {
        description: this.properties.description
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
