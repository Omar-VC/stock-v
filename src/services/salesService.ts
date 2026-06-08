import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";

const salesRef = collection(db, "sales");

// CREAR VENTA
export async function createSale(
  productId: string,
  quantity: number,
  saleType = "cash",
  customerId = "",
) {
  const productRef = doc(db, "products", productId);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    throw new Error("Producto no existe");
  }

  const product = productSnap.data();

  const stock = Number(product.stock ?? 0);
  const price = Number(product.salePrice ?? product.price ?? 0);
  const qty = Number(quantity);

  if (stock < qty) {
    throw new Error("Stock insuficiente");
  }

  const total = price * qty;

  await addDoc(salesRef, {
    productId,
    productName: product.name,
    quantity: qty,
    salePrice: price,
    total,

    saleType,
    customerId,

    status: "active",

    createdAt: Timestamp.now(),
  });

  await updateDoc(productRef, {
    stock: stock - qty,
  });
}

// OBTENER VENTAS (ordenadas por fecha)
export async function getSales() {
  const q = query(salesRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// ELIMINAR UNA VENTA
export async function deleteSale(id: string) {
  await deleteDoc(doc(db, "sales", id));
}

// LIMPIAR TODAS LAS VENTAS
export async function clearSales() {
  const snap = await getDocs(salesRef);

  const deletes = snap.docs.map((d) => deleteDoc(doc(db, "sales", d.id)));

  await Promise.all(deletes);
}

export async function cancelSale(saleId: string) {
  const saleRef = doc(db, "sales", saleId);
  const saleSnap = await getDoc(saleRef);

  if (!saleSnap.exists()) {
    throw new Error("Venta no existe");
  }

  const sale = saleSnap.data();

  if (sale.status === "cancelled") {
    throw new Error("La venta ya está anulada");
  }

  // 1. Revertir stock
  const productRef = doc(db, "products", sale.productId);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    const product = productSnap.data();
    const newStock = Number(product.stock ?? 0) + sale.quantity;

    await updateDoc(productRef, {
      stock: newStock,
    });
  }

  // 2. Si fue cuenta corriente, revertir deuda
  if (sale.saleType === "account" && sale.customerId) {
    const customerRef = doc(db, "customers", sale.customerId);
    const customerSnap = await getDoc(customerRef);

    if (customerSnap.exists()) {
      const customer = customerSnap.data();

      const newBalance =
        Number(customer.balance ?? 0) - sale.total;

      await updateDoc(customerRef, {
        balance: newBalance,
      });

      // opcional: registrar movimiento de anulación
      await addDoc(collection(db, "customerMovements"), {
        customerId: sale.customerId,
        type: "reversal",
        description: `Anulación venta ${sale.productName}`,
        amount: sale.total,
        createdAt: Date.now(),
      });
    }
  }

  // 3. Marcar venta como anulada
  await updateDoc(saleRef, {
    status: "cancelled",
  });
}