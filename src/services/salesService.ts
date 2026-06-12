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
export async function createSale({
  items,
  saleType = "cash",
  customerId = "",
}: {
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  saleType?: string;
  customerId?: string;
}) {
  if (!items || items.length === 0) {
    throw new Error("Carrito vacío");
  }

  let total = 0;

  // 1) Validar stock y descontar por cada item
  for (const item of items) {
    const productRef = doc(db, "products", item.productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      throw new Error(`Producto no existe: ${item.productName}`);
    }

    const product = productSnap.data();
    const stock = Number(product.stock ?? 0);
    const qty = Number(item.quantity);

    if (stock < qty) {
      throw new Error(`Stock insuficiente para ${item.productName}`);
    }

    await updateDoc(productRef, {
      stock: stock - qty,
    });

    total += item.price * qty;
  }

  // 2) Crear venta única
  const saleData = {
    items: items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      price: i.price,
    })),

    total,
    saleType,
    customerId: saleType === "account" ? customerId : "",

    status: "active",
    createdAt: Timestamp.now(),
  };

  const saleDoc = await addDoc(salesRef, saleData);

  // 3) Cuenta corriente (SOLO UNA VEZ)
  if (saleType === "account") {
    if (!customerId) {
      throw new Error("Cliente requerido para cuenta corriente");
    }

    const customerRef = doc(db, "customers", customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      throw new Error("Cliente no existe");
    }

    const customer = customerSnap.data();

    const newBalance = Number(customer.balance ?? 0) + total;

    await updateDoc(customerRef, {
      balance: newBalance,
    });

    // movimiento único
    await addDoc(collection(db, "customerMovements"), {
      customerId,
      type: "debt",
      description: items
        .map((i) => `${i.productName} x${i.quantity}`)
        .join(" | "),
      amount: total,
      createdAt: Timestamp.now(),
    });
  }

  return saleDoc.id;
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

  // 1) Revertir stock por cada item
  if (sale.items && Array.isArray(sale.items)) {
    for (const item of sale.items) {
      const productRef = doc(db, "products", item.productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const product = productSnap.data();

        const newStock = Number(product.stock ?? 0) + Number(item.quantity);

        await updateDoc(productRef, {
          stock: newStock,
        });
      }
    }
  }

  // 2) Revertir cuenta corriente (UNA SOLA VEZ)
  if (sale.saleType === "account" && sale.customerId) {
    const customerRef = doc(db, "customers", sale.customerId);
    const customerSnap = await getDoc(customerRef);

    if (customerSnap.exists()) {
      const customer = customerSnap.data();

      const newBalance = Number(customer.balance ?? 0) - Number(sale.total);

      await updateDoc(customerRef, {
        balance: newBalance,
      });

      // movimiento de reversa
      await addDoc(collection(db, "customerMovements"), {
        customerId: sale.customerId,
        type: "reversal",
        description: sale.items
          ?.map((i: any) => `${i.productName} x${i.quantity}`)
          .join(" | "),
        amount: sale.total,
        createdAt: Timestamp.now(),
      });
    }
  }

  // 3) Marcar venta como anulada
  await updateDoc(saleRef, {
    status: "cancelled",
  });
}

//backup de ventas
export async function backupSales() {
  const snap = await getDocs(salesRef);

  const backupRef = collection(db, "sales_backup");

  const copies = snap.docs.map((d) =>
    addDoc(backupRef, {
      ...d.data(),
      originalId: d.id,
      backupDate: Timestamp.now(),
    }),
  );

  await Promise.all(copies);
}
