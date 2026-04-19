import { db } from "./firebase"
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore"

const salesRef = collection(db, "sales")

export async function createSale(
  productId: string,
  quantity: number
) {
  // 1. traer producto
  const productRef = doc(db, "products", productId)
  const productSnap = await getDoc(productRef)

  if (!productSnap.exists()) {
    throw new Error("Producto no existe")
  }

  const product = productSnap.data()

  // 2. validar stock
  if (product.stock < quantity) {
    throw new Error("Stock insuficiente")
  }

  // 3. calcular total
  const total = product.price * quantity

  // 4. guardar venta
  await addDoc(salesRef, {
    productId,
    productName: product.name,
    quantity,
    total,
    createdAt: Timestamp.now(),
  })

  // 5. descontar stock
  await updateDoc(productRef, {
    stock: product.stock - quantity,
  })
}