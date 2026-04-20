import { db } from "./firebase"
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
} from "firebase/firestore"

const salesRef = collection(db, "sales")

// CREAR VENTA
export async function createSale(
  productId: string,
  quantity: number
) {
  const productRef = doc(db, "products", productId)
  const productSnap = await getDoc(productRef)

  if (!productSnap.exists()) {
    throw new Error("Producto no existe")
  }

  const product = productSnap.data()

  const stock = Number(product.stock ?? 0)
  const price = Number(product.salePrice ?? product.price ?? 0)
  const qty = Number(quantity)

  if (stock < qty) {
    throw new Error("Stock insuficiente")
  }

  const total = price * qty

  await addDoc(salesRef, {
    productId,
    productName: product.name,
    quantity: qty,
    salePrice: price,
    total,
    createdAt: Timestamp.now(),
  })

  await updateDoc(productRef, {
    stock: stock - qty,
  })
}

// OBTENER VENTAS (ordenadas por fecha)
export async function getSales() {
  const q = query(salesRef, orderBy("createdAt", "desc"))
  const snap = await getDocs(q)

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
}

// ELIMINAR UNA VENTA
export async function deleteSale(id: string) {
  await deleteDoc(doc(db, "sales", id))
}

// LIMPIAR TODAS LAS VENTAS
export async function clearSales() {
  const snap = await getDocs(salesRef)

  const deletes = snap.docs.map((d) =>
    deleteDoc(doc(db, "sales", d.id))
  )

  await Promise.all(deletes)
}