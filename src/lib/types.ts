export interface Product {
  id: string;
  name: string;
  category: "Velas Aromáticas" | "Manteiga Corporal" | "Difusor de Aromas" | "Outros";
  stock: number;
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
