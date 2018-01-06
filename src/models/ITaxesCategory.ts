export class TaxesCategory {
  public title: string;
  public number: number;
  public taxeCategory: number;
  public sum: number;
  public percentagePersonalDM: number;
  public percentagePersonalMM: number;
  public sumPersonalDM: number;
  public sumPersonalMM: number;


  constructor () {
    this.sum = 0;
    this.percentagePersonalDM = 0;
    this.percentagePersonalMM = 0;
    this.sumPersonalDM = 0;
    this.sumPersonalMM = 0;
    this.taxeCategory = 0;
  }

}
