import * as React from 'react';
import {IExpense} from "../../../models/IExpense";
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel} from 'office-ui-fabric-react/lib/Panel';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import {IExpensesService} from "../../../models/IExpensesService";
import * as _ from 'lodash';
import TaxonomyPicker from "react-taxonomypicker";
import "react-taxonomypicker/dist/React.TaxonomyPicker.css";
import {PanelType} from "office-ui-fabric-react/lib/components/Panel/Panel.types";
import DatePicker2 from "./inputComponents/datePicker";
import Iframe from 'react-iframe'

// TODO : quand on ferme le panel, la valeur n<est pas envoyé au parent, ce qui est un problème...
export interface IEditExpenseProps {
  expense: IExpense;  // AKA, initial value
  showPanel: boolean;
  parentToggle?: any;
  expensesService: IExpensesService;
}

export interface IEditExpenseState {
  showPanelState: boolean;
  expenseState?: IExpense; // AKA, current value in the form
  testtitle?: string;

  title?: string;
  name?: string;
  provider?: string;
  manager?: string;
  date?: Date;
  price?: number;
  //cat impot
  //cat document
  // logement
  p?: boolean;
  //note
  // r
  // valide
}


export default class EditExpense extends React.Component<IEditExpenseProps, IEditExpenseState> {
  //showPanel:boolean;


  constructor(props: IEditExpenseProps) {
    console.log('...EditExpense - Constructor');
    super(props);

    this.state = {
      showPanelState: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public componentWillReceiveProps() {
    this.setState({
      showPanelState: this.props.showPanel,
      expenseState: this.props.expense
    });
  }

  @autobind
  private _cancel(): void {
    console.log(this.state.testtitle);
    //this.props.parentToggle.bind(this);
    //this.setState({
    //  showPanelState: false
    //});
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
    console.log(this.state.expenseState);
    let expenseToSave: any = _.omit(this.state.expenseState, ['dateFormatted', 'dateValue', 'modified', 'relativeEditLink', 'type', 'created', 'year']);
    expenseToSave = this.renameObjectKey(expenseToSave, 'price', 'Prix');
    expenseToSave = this.renameObjectKey(expenseToSave, 'validated', 'Valide');
    expenseToSave = this.renameObjectKey(expenseToSave, 'date', 'Date1');
    expenseToSave = this.renameObjectKey(expenseToSave, 'authorId', 'AuthorId');
    expenseToSave = this.renameObjectKey(expenseToSave, 'providerId', 'FournisseursId');
    expenseToSave = this.renameObjectKey(expenseToSave, 'title', 'Title');
    expenseToSave = this.renameObjectKey(expenseToSave, 'manager', 'GestionnairesChoice');
    expenseToSave = this.renameObjectKey(expenseToSave, 'p', 'P');


    await this.props.expensesService.saveExpense(expenseToSave);
    console.log('saved done');
    this.props.parentToggle.bind(this);
    this.setState({
      showPanelState: false
    });
  }

  public componentDidMount() {
    console.log('...editExpense - componentDidMount');

  }


  private handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  @autobind
  private onBlur(event) {
    console.log('onBlur');
    //console.log(event);
  }

  @autobind
  private onFocus(event) {
    console.log('onFocus');
    //console.log(event);
  }

  @autobind
  private onInput(event) {
    console.log('onInput');
    console.log(event);
  }

  public render(): React.ReactElement<IEditExpenseProps> {
    console.log('...editExpense - render');
    let editPanel: JSX.Element = null;
    //let showPanel = this.props.showPanel;


    if (this.state.expenseState) {
      editPanel =

        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm6">
              <TextField
                label='Nom du fichier'
                type="text"
                name="name"
                onChange={this.handleInputChange}
                value={this.state.name}
                defaultValue={this.props.expense.FileLeafRef}
              />
              <TextField
                label='Titre'
                type="text"
                name="title"
                onChange={this.handleInputChange}
                value={this.state.title}
                defaultValue={this.props.expense.title}
              />
              <br/>
              <TaxonomyPicker
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
              <br/>
              <span>Date de la dépense</span>
              <DatePicker2/>
              <br/>
              <input name="testtitle" type="text" value={this.state.testtitle} onChange={this.handleInputChange}/>
            </div>
            <div className="ms-Grid-col ms-sm6">
              <Iframe url={this.state.expenseState.ServerRedirectedEmbedUri}
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
          isOpen={this.state.showPanelState}
          // tslint:disable-next-line:jsx-no-lambda
          onDismiss={() => this.setState({showPanelState: false})}
          type={PanelType.large}
          headerText='Large Panel'
        >

          <span>Content goes here.   bloa bla bla</span><br/>
          <span>title : {this.state.title}</span><br/>
          <span>test title : {this.state.testtitle}</span><br/>

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
