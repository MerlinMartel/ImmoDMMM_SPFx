export interface IExpense {
  id: number;
  title?: string;
  FileLeafRef?: string;
  price?: number;
  validated?: boolean;
  manager?: string; // TODO trouver un meilleur nom
  date?: Date;  // TODO pas un string...
  dateValue?:number;
  dateFormatted?:string;
  year?: number;
  authorId?: number;
  created: string;
  modified: string;
  providerId?: number;
  provider?: string;
  flatId?: number;
  flat?: string;
  taxCategoryId?: number;
  taxCategory?: string;
  relativeEditLink?: string;
  type?: string;
  p?:boolean;
  ServerRedirectedEmbedUri:string;
}
