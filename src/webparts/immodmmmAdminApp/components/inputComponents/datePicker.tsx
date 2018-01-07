import * as React from 'react';
import {autobind} from "office-ui-fabric-react/lib/Utilities";
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import {DayOfWeek, IDatePickerStrings, IDropdownOption} from "office-ui-fabric-react";
import * as moment from 'moment';

const DayPickerStrings: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],

  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],

  shortDays: [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S'
  ],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year'
};


export interface IDatePickerProps {

}

export interface IDatePickerState {
  firstDayOfWeek?: DayOfWeek;
  selectedDate?:Date | null;
}

export default class DatePicker2 extends React.Component<IDatePickerProps, IDatePickerState> {
  constructor(props: IDatePickerProps) {
    console.log('...EditExpense - Constructor');
    super(props);

    this.state = {
      firstDayOfWeek: DayOfWeek.Sunday,
      selectedDate: null
    };
  }
  public render(){
    let { firstDayOfWeek } = this.state;
    return (
      <div>
        <DatePicker
          firstDayOfWeek={ firstDayOfWeek }
          strings={ DayPickerStrings }
          placeholder='Choisir une date...'
          value={ this.state.selectedDate }
          onSelectDate={ this._onSelectDate }
          formatDate={ this._onFormatDate }
          parseDateFromString={ this._onParseDateFromString }
        />
      </div>
    );

  }
  private _onSelectDate(event){
    console.log(event);
    this.setState({
      selectedDate: event
    })
  }
  @autobind
  private _onFormatDate(date: Date): string {
    return (
      moment(date).format('YYYY/MM/DD')
    )
  }

  @autobind
  private _onParseDateFromString(value: string): Date {
    // je pense que ceci est utilisé quand on permet de faire de l'input sur le date picker... ce qui est pas mon cas..
    let date = this.state.selectedDate || new Date();
    let values = (value || '').trim().split('/');
    let day =
      values.length > 0
        ? Math.max(1, Math.min(31, parseInt(values[0], 10)))
        : date.getDate();
    let month =
      values.length > 1
        ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1
        : date.getMonth();
    let year = values.length > 2 ? parseInt(values[2], 10) : date.getFullYear();
    if (year < 100) {
      year += date.getFullYear() - date.getFullYear() % 100;
    }
    return new Date(year, month, day);
  }
}
