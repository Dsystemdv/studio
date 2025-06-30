import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, Sale, Invoice } from '@/lib/types';

// --- Seed Data (from original db.json) ---
const seedProducts: Product[] = [
  {
    id: 'p1',
    name: 'Vela de Lavanda',
    category: 'Velas Aromáticas',
    stock: 50,
    price: 35,
  },
  {
    id: 'p2',
    name: 'Vela de Baunilha',
    category: 'Velas Aromáticas',
    stock: 3,
    price: 35,
  },
  {
    id: 'p3',
    name: 'Manteiga de Karité',
    category: 'Manteiga Corporal',
    stock: 30,
    price: 45,
  },
  {
    id: 'p4',
    name: 'Difusor de Bambu',
    category: 'Difusor de Aromas',
    stock: 40,
    price: 55,
  },
  {
    id: 'p5',
    name: 'Vela de Canela',
    category: 'Velas Aromáticas',
    stock: 25,
    price: 38,
  },
  {
    id: 'p6',
    name: 'Manteiga de Cacau e Menta',
    category: 'Manteiga Corporal',
    stock: 8,
    price: 48,
  },
  {
    id: 'p7',
    name: 'Difusor de Flor de Cerejeira',
    category: 'Difusor de Aromas',
    stock: 22,
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


async function seedCollection<T extends { id: string }>(
  collectionName: string,
  data: T[]
) {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(query(collectionRef));
  if (snapshot.empty) {
    console.log(`Seeding '${collectionName}' collection...`);
    const batch = writeBatch(db);
    data.forEach((item) => {
      const docRef = doc(db, collectionName, item.id);
      const { id, ...itemData } = item;
      batch.set(docRef, itemData);
    });
    await batch.commit();
  }
}

// Helper to run seeding only once per server start.
const seedPromise = (async () => {
    try {
        await Promise.all([
            seedCollection<Product>('products', seedProducts),
            seedCollection<Sale>('sales', seedSales),
            seedCollection<Invoice>('invoices', seedInvoices),
        ]);
    } catch (error) {
        if (error instanceof Error && error.message.includes("Failed to get document because the client is offline")) {
            console.warn("Firestore is offline. Could not seed database. Please configure src/lib/firebase.ts and restart the server.");
        } else {
            console.error("Error seeding database:", error);
        }
    }
})();

async function handleFirebaseRead<T>(operation: Promise<T>, fallback: T): Promise<T> {
  try {
    await seedPromise;
    return await operation;
  } catch (error) {
    console.error("Firebase read operation failed. Have you configured src/lib/firebase.ts?", error);
    return fallback;
  }
}

export const getProducts = async (): Promise<Product[]> => {
  return handleFirebaseRead(
    (async () => {
      const productsCol = collection(db, 'products');
      const productSnapshot = await getDocs(productsCol);
      return productSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Product
      );
    })(),
    []
  );
};

export const getSales = async (): Promise<Sale[]> => {
    return handleFirebaseRead(
        (async () => {
            const salesCol = collection(db, 'sales');
            const salesSnapshot = await getDocs(salesCol);
            return salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
        })(),
        []
    );
};

export const getInvoices = async (): Promise<Invoice[]> => {
    return handleFirebaseRead(
        (async () => {
            const invoicesCol = collection(db, 'invoices');
            const invoicesSnapshot = await getDocs(invoicesCol);
            return invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
        })(),
        []
    );
};

export const getLowStockProducts = async (
  threshold = 10
): Promise<Product[]> => {
    return handleFirebaseRead(
        (async () => {
            const q = query(collection(db, 'products'), where('stock', '<', threshold));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        })(),
        []
    );
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    return handleFirebaseRead(
        (async () => {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : undefined;
        })(),
        undefined
    );
};
