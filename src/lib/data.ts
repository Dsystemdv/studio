import type { Product, Sale, Invoice } from '@/lib/types';

// --- Dados de Exemplo (usados como fallback e para desenvolvimento) ---
const seedProducts: Product[] = [
  {
    id: 'p1',
    name: 'Vela de Lavanda',
    category: 'Velas Aromáticas',
    stock: 50,
    costPrice: 15,
    price: 35,
  },
  {
    id: 'p2',
    name: 'Vela de Baunilha',
    category: 'Velas Aromáticas',
    stock: 3,
    costPrice: 15,
    price: 35,
  },
  {
    id: 'p3',
    name: 'Manteiga de Karité',
    category: 'Manteiga Corporal',
    stock: 30,
    costPrice: 20,
    price: 45,
  },
  {
    id: 'p4',
    name: 'Difusor de Bambu',
    category: 'Difusor de Aromas',
    stock: 40,
    costPrice: 25,
    price: 55,
  },
  {
    id: 'p5',
    name: 'Vela de Canela',
    category: 'Velas Aromáticas',
    stock: 25,
    costPrice: 18,
    price: 38,
  },
  {
    id: 'p6',
    name: 'Manteiga de Cacau e Menta',
    category: 'Manteiga Corporal',
    stock: 8,
    costPrice: 22,
    price: 48,
  },
  {
    id: 'p7',
    name: 'Difusor de Flor de Cerejeira',
    category: 'Difusor de Aromas',
    stock: 22,
    costPrice: 28,
    price: 60,
  },
];

const seedSales: Sale[] = [
    {
      "id": "s2",
      "date": "2024-07-03",
      "items": [
        { "productId": "p3", "quantity": 1, "price": 45 },
        { "productId": "p4", "quantity": 1, "price": 55 }
      ],
      "total": 100
    },
    {
      "id": "s3",
      "date": "2024-07-05",
      "items": [{ "productId": "p2", "quantity": 3, "price": 35 }],
      "total": 105
    },
    {
      "id": "s4",
      "date": "2024-06-10",
      "items": [{ "productId": "p5", "quantity": 1, "price": 38 }],
      "total": 38
    },
    {
      "id": "s5",
      "date": "2024-06-15",
      "items": [{ "productId": "p6", "quantity": 2, "price": 48 }],
      "total": 96
    },
    {
      "id": "s6",
      "date": "2024-06-20",
      "items": [{ "productId": "p7", "quantity": 1, "price": 60 }],
      "total": 60
    },
    {
      "id": "s7",
      "date": "2024-05-25",
      "items": [{ "productId": "p1", "quantity": 5, "price": 35 }],
      "total": 175
    }
];

const seedInvoices: Invoice[] = [
  {
    "id": "i1",
    "date": "2024-06-15",
    "supplier": "Fornecedor de Cera",
    "items": [{ "productName": "Cera de Soja", "quantity": 10, "cost": 200 }],
    "total": 200
  },
  {
    "id": "i2",
    "date": "2024-06-20",
    "supplier": "Fornecedor de Óleos",
    "items": [{ "productName": "Óleo Essencial Lavanda", "quantity": 5, "cost": 150 }],
    "total": 150
  },
  {
    "id": "i3",
    "date": "2024-06-25",
    "supplier": "Fornecedor de Embalagens",
    "items": [{ "productName": "Potes de Vidro", "quantity": 100, "cost": 300 }],
    "total": 300
  }
];

// NOTA: Estas funções agora retornam dados de exemplo.
// Substitua a lógica interna para buscar dados do seu banco de dados externo.

export const getProducts = async (): Promise<Product[]> => {
  console.log("Buscando produtos dos dados de exemplo...");
  // Simula uma chamada de rede
  await new Promise(resolve => setTimeout(resolve, 50));
  return seedProducts;
};

export const getSales = async (): Promise<Sale[]> => {
    console.log("Buscando vendas dos dados de exemplo...");
    await new Promise(resolve => setTimeout(resolve, 50));
    return seedSales;
};

export const getInvoices = async (): Promise<Invoice[]> => {
    console.log("Buscando notas de entrada dos dados de exemplo...");
    await new Promise(resolve => setTimeout(resolve, 50));
    return seedInvoices;
};

export const getLowStockProducts = async (
  threshold = 10
): Promise<Product[]> => {
    console.log("Buscando produtos com baixo estoque dos dados de exemplo...");
    await new Promise(resolve => setTimeout(resolve, 50));
    return seedProducts.filter(p => p.stock < threshold);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    console.log(`Buscando produto com ID ${id} dos dados de exemplo...`);
    await new Promise(resolve => setTimeout(resolve, 50));
    return seedProducts.find(p => p.id === id);
};
