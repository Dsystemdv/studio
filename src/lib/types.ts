export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  costPrice: number;
  price: number;
}

export interface Sale {
  id: string;
  date: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export interface Invoice {
  id: string;
  date: string;
  supplier: string;
  items: {
    productName: string;
    quantity: number;
    cost: number;
  }[];
  total: number;
}

export interface Client {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
}

export interface Database {
  products: Product[];
  sales: Sale[];
  invoices: Invoice[];
  clients: Client[];
}
