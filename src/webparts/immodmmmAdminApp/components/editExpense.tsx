import * as React from 'react';
import {IExpense} from "../../../models/IExpense";
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel} from 'office-ui-fabric-react/lib/Panel';
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import {IExpensesService} from "../../../models/IExpensesService";
import * as _ from 'lodash';
import {PanelType} from "office-ui-fabric-react/lib/components/Panel/Panel.types";
import Iframe from 'react-iframe';
import TextFieldControl from "@umaknow/uma-fabric/lib/controls/TextFieldControl/TextFieldControl";
import IListItemProperty from "@umaknow/uma-fabric/lib/models/IListItemProperty";
import DatePickerControl from "@umaknow/uma-fabric/lib/controls/DatePickerControl/DatePickerControl";
import TaxonomyPickerControl from "@umaknow/uma-fabric/lib/controls/TaxonomyPickerControl/TaxonomyPickerControl";
import { IWebPartContext } from "@microsoft/sp-webpart-base/lib";
import ITaxonomyDataProvider from "@umaknow/uma-fabric/lib/dataProviders/ITaxonomyDataProvider";
import TaxonomyDataProvider from "@umaknow/uma-fabric/lib/dataProviders/TaxonomyProvider";
import ListItemDataProvider from "@umaknow/uma-fabric/lib/dataProviders/ListItemDataProvider";
import IListItemDataProvider from "@umaknow/uma-fabric/lib/dataProviders/IListItemDataProvider";
import ToggleFieldControl from "@umaknow/uma-fabric/lib/controls/ToggleFieldControl/ToggleFieldControl";
import DropDownControl from "@umaknow/uma-fabric/lib/controls/DropDownControl/DropDownControl";
import {ISelectableOption} from "office-ui-fabric-react/lib-amd/utilities/selectableOption";
import {IProvider} from "../../../models/IProvider";


// TODO : aller voir desjardins de rabih... dans on oninit, il devrait avoir des d/pendance  SPCOmponentloader.

// TODO : faire le select de champ autpmatique. voicir baseSearchService.tx.      et schema.ts    variable schema et reverseschema  (voir news service aussi)

export interface IEditExpenseProps {
  expense: IExpense;  // AKA, initial value
  showPanel: boolean;
  parentToggle?: any;
  expensesService: IExpensesService;


  onPanelDismiss();
  context: IWebPartContext;
}

export interface IEditExpenseState {
  showPanelState: boolean;
  expenseState?: IExpense; // AKA, current value in the form
  testtitle?: string;
  providersDropDownOptions?:any;

  /*
  title?: string;
  name?: string;
  provider?: any;
  manager?: string;
  date?: Date;
  price?: number;

*/
  //cat impot
  //cat document
  // logement
  //p?: boolean;
  //note
  // r
  // valide
}


export default class EditExpense extends React.Component<IEditExpenseProps, IEditExpenseState> {
  //showPanel:boolean;
  private fieldPropertyTitle?: IListItemProperty;
  private fieldPropertyFileName?: IListItemProperty;
  private fieldPropertyDate?: IListItemProperty;
  private fieldPropertyPrice?: IListItemProperty;
  private fieldPropertyTaxCategory?: IListItemProperty;
  private fieldPropertyFlat?: IListItemProperty;
  private fieldPropertyProvider?: IListItemProperty;
  private fieldPropertyValidated?: IListItemProperty;
  private fieldPropertyP?: IListItemProperty;
  private allfields?: IListItemProperty[];
  private taxonomyDataProvider: ITaxonomyDataProvider;
  private _listItemDataProvider:IListItemDataProvider;

  constructor(props: IEditExpenseProps) {
    //console.log('...EditExpense - Constructor');
    super(props);

    this.allfields = []; //this.fieldPropertyProvider

    // TODO : faire ce call plus haut...
    this.taxonomyDataProvider = new TaxonomyDataProvider(this.props.context, 1033);

    this._listItemDataProvider = new ListItemDataProvider(this.props.context, 1033);
    this.state = {
      showPanelState: this.props.showPanel,
      expenseState: this.props.expense
    };
  }

  public componentDidMount() {
    //console.log('...EditExpense - componentDidMount');
    this.getProviders(this.props);
  }

  @autobind
  private _cancel(): void {
    this.props.onPanelDismiss();

  }


  private renameObjectKey(obj, key, newKey) {
    if (_.includes(_.keys(obj), key)) {
      obj[newKey] = _.clone(obj[key], true);
      delete obj[key];
    }
    return obj;
  }

  @autobind
  private async _save(): Promise<any> {

    // TODO : changer le nom du fichier ne fonctionne pas !! :-(
    await this._listItemDataProvider.updateLisItemProperties(Number(this.state.expenseState.id),'39676029-b0e2-414a-8103-4e5f22544562',this.allfields);
    //await this.props.expensesService.saveExpense(expenseToSave);
    console.log('saved done');
    this.props.onPanelDismiss();  //TODO : ok de faire comme ceci ?
  }



  @autobind
  private async getProviders(props: IEditExpenseProps){
    let providersForDropDown:ISelectableOption[] = [];
    let providersRaw:any = await props.expensesService.getProviderItems();
    providersRaw.map((p:any) => {
      let providerItem:ISelectableOption = {"key": p.Id, "text": p.Title};
      providersForDropDown.push(providerItem);
    });
    let sortedprovidersForDropDown = _.sortBy(providersForDropDown, (p:ISelectableOption) => {return p.text});
    console.log(sortedprovidersForDropDown);
    this.setState({
      providersDropDownOptions: sortedprovidersForDropDown
    });
  }

  @autobind
  private handleFieldChange(fieldInfo:IListItemProperty) {
    // Works with date, text, number
    let temp = this.state.expenseState;
    temp[fieldInfo.FieldInfo.InternalName] = fieldInfo.Value;
    this.setState({
      expenseState: temp
    });

  }

/*
  private _onFieldUpdated(updatedProperty: IListItemProperty, fieldHasErrors: boolean) {

    //let fieldErrors = this.state.fieldErrors;

    // Update errors count
    //fieldErrors[updatedProperty.InternalName] = fieldHasErrors;

    // Every time a child sends a notification, we update the container main state with the current values
    let updatedProperties: IListItemProperty[] = this.state.updatedPageProperties;

    const initialProperty = find(this.state.initialPageProperties, (elt) => { return elt.InternalName === updatedProperty.InternalName; });
    let initialPropertyValue = initialProperty.Value;
    let udpatedPropertyValue = updatedProperty.Value;

    if (updatedProperty.FieldInfo.Type === "DateTime") {
      // Convert the date value as date to be able to compare them easily (instead of strings)
      initialPropertyValue = new Date(initialPropertyValue);
      udpatedPropertyValue = new Date(udpatedPropertyValue);
    }

    // If the value is the same as the original, we remove the property from the updated properties list
    if (isEqual(initialPropertyValue, udpatedPropertyValue)) {

      // Remove the property from the updatedPageProperties list
      updatedProperties = updatedProperties.filter((elt) => { return elt.InternalName !== updatedProperty.InternalName; });

    } else {
      // Else, we replace the existing value by the new one
      const existingIdx = findIndex(updatedProperties, { InternalName: updatedProperty.InternalName });
      existingIdx !== -1 ? updatedProperties.splice(existingIdx, 1, updatedProperty) : updatedProperties.push(updatedProperty);
    }

    this.setState({
      updatedPageProperties: updatedProperties,
      fieldErrors: fieldErrors,
    });
  }
*/

  public render(): React.ReactElement<IEditExpenseProps> {
    console.log('...editExpense -  render');
    let editPanel: JSX.Element = null;
    //let showPanel = this.props.showPanel;
    let options:ISelectableOption[] =
      [{ key: 'AA', text: 'Option aa' },{ key: 'AB', text: 'Option ab' }];







    if (this.state.expenseState && this.state.providersDropDownOptions) {
      this.fieldPropertyTitle = {
        Value : this.state.expenseState.title,
        InternalName: "Title",
        FieldInfo : {
          InternalName: "title",
          Title: "Titre",
          Type : "Text",
          Required: false
        }
      };
      this.fieldPropertyFileName = {
        Value : this.state.expenseState.fileName,
        InternalName: "FileLeafRef",
        FieldInfo : {
          InternalName: "fileName",
          Title: "Nom du fichier",
          Type : "Text",
          Required: true,
        }
      };
      this.fieldPropertyDate = {
        Value : this.state.expenseState.dateValue,
        InternalName: "Date1",
        FieldInfo : {
          InternalName: "date",
          Title: "Date",
          Type : "DateTime",
          Required: false
        }
      };
      this.fieldPropertyPrice = {
        Value : this.state.expenseState.price,
        InternalName: "Prix",
        FieldInfo : {
          InternalName: "price",
          Title: "Prix",
          Type : "Currency",
          Required: false
        }
      };
      this.fieldPropertyTaxCategory = {
        Value : this.state.expenseState.taxCategoryId,
        InternalName : "TaxesCategory",
        FieldInfo : {
          InternalName: "taxCategoryId",
          Title: "Catégorie de taxe",
          Type : "TaxonomyFieldType",
          Required: false,
          TermSetId: '8bdcb6ba-48e1-4493-88ee-50e7abc5701a',
          TextField: '53897e1e-9f97-4368-9536-f411887d356c'
        }
      };
      this.fieldPropertyFlat = {
        Value : this.state.expenseState.flatId,
        InternalName: "Logements",
        FieldInfo : {
          InternalName: "flatId",
          Title: "Logement",
          Type : "TaxonomyFieldType",
          Required: false,
          TermSetId: 'd6bcd487-69d8-4ec7-9c00-3d1b1219cae8',
          TextField: '2871ba5e-070d-49d7-b039-ea1ace4fa927'
        }
      };

      this.fieldPropertyProvider = {
        Value : this.state.expenseState.provider,
        InternalName: "FournisseursId",
        FieldInfo : {
          InternalName: "provider",
          Title: "Fournisseur",
          Type : "Lookup",
          Required: false,
          DropDownOptions: this.state.providersDropDownOptions
        }
      };
      this.fieldPropertyValidated = {
        Value : this.state.expenseState.validated,
        InternalName: "Valide",
        FieldInfo : {
          InternalName: "validated",
          Title: "Validé",
          Type : "Boolean",
          Required: false
        }
      };
      this.fieldPropertyP = {
        Value : this.state.expenseState.p,
        InternalName : "P",
        FieldInfo : {
          InternalName: "p",
          Title: "P",
          Type : "Boolean",
          Required: false,
        }
      };
      this.allfields = [this.fieldPropertyValidated,this.fieldPropertyDate,this.fieldPropertyFlat,this.fieldPropertyP,this.fieldPropertyPrice,this.fieldPropertyTaxCategory,this.fieldPropertyTitle,this.fieldPropertyProvider];

      /*<TaxonomyPicker
  name="flat"
  displayName="Logement(s)"
  termSetGuid="d6bcd487-69d8-4ec7-9c00-3d1b1219cae8"
  termSetName="1821 Bennett - Logements"
  termSetCountMaxSwapToAsync={100}
  defaultValue={this.props.expense.flat}
  multi={false}
/>
<TaxonomyPicker
  name="catTaxes"
  displayName="Catégories d'impôts"
  termSetGuid="8bdcb6ba-48e1-4493-88ee-50e7abc5701a"
  termSetName="Catégories d'impôts"
  termSetCountMaxSwapToAsync={100}
  multi={false}
/>
<TaxonomyPicker
  name="catDoc"
  displayName="Catégories Documents"
  termSetGuid="761aa6ef-99fc-41be-8a3d-811683e6b925"
  termSetName="Catégories Documents"
  termSetCountMaxSwapToAsync={100}
  multi={false}
/>
*/

      editPanel =
      <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6">
              <TextFieldControl
                disabled={false}
                pageField={this.fieldPropertyTitle}
                onFieldUpdated={this.handleFieldChange}
                shouldReset={false}
              />
              <TextFieldControl
                disabled={true}
                pageField={this.fieldPropertyFileName}
                onFieldUpdated={this.handleFieldChange}
                shouldReset={false}
              />
              <TextFieldControl
                disabled={false}
                pageField={this.fieldPropertyPrice}
                onFieldUpdated={this.handleFieldChange}
                shouldReset={false}
              />
              <DatePickerControl
                disabled={false}
                pageField={this.fieldPropertyDate}
                onFieldUpdated={this.handleFieldChange}
                shouldReset={false}
              />
              <TaxonomyPickerControl
                taxonomyDataProvider={this.taxonomyDataProvider}
                disabled={false}
                context={this.props.context as IWebPartContext}
                pageField={this.fieldPropertyTaxCategory}
                isMulti={false}
                onFieldUpdated={this.handleFieldChange}
                shouldReset={false}/>
              <TaxonomyPickerControl
                taxonomyDataProvider={this.taxonomyDataProvider}
                disabled={false}
                context={this.props.context as IWebPartContext}
                pageField={this.fieldPropertyFlat}
                isMulti={false}
                onFieldUpdated={this.handleFieldChange}
                shouldReset={false}/>
              <DropDownControl
                disabled={false}
                pageField={this.fieldPropertyProvider}
                onFieldUpdated={this.handleFieldChange}
                shouldReset={false}
              />
              <ToggleFieldControl
                disabled={false}
                pageField={this.fieldPropertyValidated}
                onFieldUpdated={this.handleFieldChange}
                shouldReset={false}
              />
              <ToggleFieldControl
                disabled={false}
                pageField={this.fieldPropertyP}
                onFieldUpdated={this.handleFieldChange}
                shouldReset={false}
              />


            </div>
            <div className="ms-Grid-col ms-sm6">
              <Iframe url={this.state.expenseState.previewUrl}
                      width="100%"
                      height="700px"
                      id="myId"
                      className="myClassname"
                      display="initial"
                      position="relative"
                      allowFullScreen/>
            </div>
          </div>
        </div>;
    } else {
      editPanel = <div>nothing to show</div>;
    }

    return (
      <div>
        <Panel
          isOpen={this.props.showPanel}
          // tslint:disable-next-line:jsx-no-lambda
          onDismiss={() => this.props.onPanelDismiss()}
          type={PanelType.large}
          headerText='Large Panel'
        >


          {editPanel}

          <br/>

          <DefaultButton
            // primary={ true } -  not present in office ui fabric 4.40 (was in version 5)
            data-automation-id='test'
            text='Enregistrer'
            onClick={this._save}
          />

          <DefaultButton
            data-automation-id='test'
            text='Annuler'
            onClick={this._cancel}
          />


        </Panel>
      </div>
    );
  }
}
