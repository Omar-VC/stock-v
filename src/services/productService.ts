import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Product } from "../types/product"

const ref = collection(db, "products")

export const getProducts = async (): Promise<Product[]> => {
  const snap = await getDocs(ref)

  return snap.docs.map((d) => {
    const data = d.data()

    return {
      id: d.id,
      name: data.name ?? "",
      variant: data.variant ?? "",
      stock: Number(data.stock ?? 0),
      salePrice: Number(data.salePrice ?? data.price ?? 0),
      costPrice: Number(data.costPrice ?? 0),
      imageUrl: data.imageUrl ?? "",
    }
  })
}

export const createProduct = async (
  data: Omit<Product, "id">
) => {
  await addDoc(ref, {
    ...data,
    stock: Number(data.stock),
    salePrice: Number(data.salePrice),
    costPrice: Number(data.costPrice),
  })
}

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id))
}

export const updateProduct = async (
  id: string,
  data: Partial<Product>
) => {
  await updateDoc(doc(db, "products", id), {
    ...data,
    stock: Number(data.stock ?? 0),
    salePrice: Number(data.salePrice ?? 0),
    costPrice: Number(data.costPrice ?? 0),
  })
}