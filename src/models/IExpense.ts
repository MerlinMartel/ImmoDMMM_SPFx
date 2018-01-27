import ITaxonomyTermValue from "@umaknow/uma-fabric/lib/models/ITaxonomyTermValue";
import ILookupValue from "@umaknow/uma-fabric/lib/models/ILookupValue";

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
  provider?: ILookupValue;
  flatId?: ITaxonomyTermValue;
  flat?: string;
  taxCategoryId?: ITaxonomyTermValue;
  taxCategory?: string;
  relativeEditLink?: string;
  type?: string;
  p?:boolean;
  previewUrl:string;
}
