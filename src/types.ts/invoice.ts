import { IAddressItem } from './address';

// ----------------------------------------------------------------------

export type IInvoiceTableFilterValue = string | string[] | Date | null;

export type IInvoiceTableFilters = {
  name: string;
  service: string[];
  status: string | null;
  startDate: Date | null; // Type 'null' is not assignable to type 'Date'.
  endDate: Date | null;   // Type 'null' is not assignable to type 'Date'.
  created_at: Date | null;
  user_id: string;
  client: string;
  updated_at: Date | null; // Type 'null' is not assignable to type 'Date'.
  id: string;

}
// ----------------------------------------------------------------------

export type IInvoiceItem = {
  id: string;
  title: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  description: string;
};

export type IInvoice = {
  id: string;
  created_at: Date;
  user_id: string,
  status: string;
  client: string;
  updated_at: Date;
  name: string;
  // Add other fields as needed
  projectNumber: any;
  sent: number;
  dueDate: Date;
  taxes: number;
  subTotal: number;
  createDate: Date;
  discount: number;
  shipping: number;
  totalAmount: number;
  invoiceNumber: string;
  items: IInvoiceItem[];
  invoiceTo: IAddressItem;
  invoiceFrom: IAddressItem;
};
