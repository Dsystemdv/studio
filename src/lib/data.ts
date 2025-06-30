import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, firebaseConfig } from './firebase';
import type { Product, Sale, Invoice } from '@/lib/types';

// Check if Firebase is configured by checking if the project ID is still the placeholder
const isFirebaseConfigured = firebaseConfig.projectId !== 'your-project-id';

// --- Seed Data (remains the source of truth if Firebase is not configured) ---
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


let initializationPromise: Promise<void> | null = null;
const initializeDatabase = () => {
    if (initializationPromise) {
        return initializationPromise;
    }
    initializationPromise = (async () => {
        if (!isFirebaseConfigured) {
            console.warn("Firebase is not configured. Using local mock data. To use Firestore, please configure src/lib/firebase.ts and restart the server.");
            return;
        }
        try {
            const productsRef = collection(db, 'products');
            const snapshot = await getDocs(productsRef);
            if (snapshot.empty) {
                console.log("Products collection is empty, seeding database...");
                const batch = writeBatch(db);

                seedProducts.forEach((item) => {
                    const docRef = doc(db, 'products', item.id);
                    const { id, ...itemData } = item;
                    batch.set(docRef, itemData);
                });

                seedSales.forEach((item) => {
                    const docRef = doc(db, 'sales', item.id);
                    const { id, ...itemData } = item;
                    batch.set(docRef, itemData);
                });

                seedInvoices.forEach((item) => {
                    const docRef = doc(db, 'invoices', item.id);
                    const { id, ...itemData } = item;
                    batch.set(docRef, itemData);
                });
                
                await batch.commit();
                console.log("Database seeded successfully.");
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes("PERMISSION_DENIED")) {
                console.error("Firestore Error: PERMISSION_DENIED. This is likely because the Firestore API is not enabled in your Google Cloud project, or your security rules are too restrictive. Using local mock data as a fallback.");
            } else {
                console.error("An error occurred while seeding the database. Using local mock data as a fallback.", error);
            }
        }
    })();
    return initializationPromise;
};

export const getProducts = async (): Promise<Product[]> => {
  await initializeDatabase();
  if (!isFirebaseConfigured) return seedProducts;

  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    if (productSnapshot.empty) return seedProducts;
    return productSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Product
    );
  } catch (error) {
    console.error("Failed to fetch products from Firestore. Falling back to local data.", error);
    return seedProducts;
  }
};

export const getSales = async (): Promise<Sale[]> => {
    await initializeDatabase();
    if (!isFirebaseConfigured) return seedSales;

    try {
        const salesCol = collection(db, 'sales');
        const salesSnapshot = await getDocs(salesCol);
        if (salesSnapshot.empty) return seedSales;
        return salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
    } catch (error) {
        console.error("Failed to fetch sales from Firestore. Falling back to local data.", error);
        return seedSales;
    }
};

export const getInvoices = async (): Promise<Invoice[]> => {
    await initializeDatabase();
    if (!isFirebaseConfigured) return seedInvoices;

    try {
        const invoicesCol = collection(db, 'invoices');
        const invoicesSnapshot = await getDocs(invoicesCol);
        if (invoicesSnapshot.empty) return seedInvoices;
        return invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
    } catch (error) {
        console.error("Failed to fetch invoices from Firestore. Falling back to local data.", error);
        return seedInvoices;
    }
};

export const getLowStockProducts = async (
  threshold = 10
): Promise<Product[]> => {
    await initializeDatabase();
    if (!isFirebaseConfigured) {
        return seedProducts.filter(p => p.stock < threshold);
    }
    
    try {
        const q = query(collection(db, 'products'), where('stock', '<', threshold));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.error("Failed to fetch low stock products from Firestore. Falling back to local data.", error);
        return seedProducts.filter(p => p.stock < threshold);
    }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    await initializeDatabase();
    if (!isFirebaseConfigured) {
        return seedProducts.find(p => p.id === id);
    }

    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : undefined;
    } catch (error) {
        console.error(`Failed to fetch product ${id} from Firestore. Falling back to local data.`, error);
        return seedProducts.find(p => p.id === id);
    }
};
