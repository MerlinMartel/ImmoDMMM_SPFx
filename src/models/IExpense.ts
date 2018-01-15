export interface IExpense {
  id: string;
  title: string;
  fileName?: string;
  price: number;
  validated: boolean;
  manager: string; // TODO trouver un meilleur nom
  date: Date;  // TODO pas un string...
  dateValue?:number;
  dateFormatted?:string;
  providerId?: number;
  provider?: string;
  flatId?: number;
  flat?: string;
  taxCategoryId?: number;
  taxCategory?: string;
  relativeEditLink?: string;
  type?: string;
  p?:boolean;
  previewUrl:string;
}
