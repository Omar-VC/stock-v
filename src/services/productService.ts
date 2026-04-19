import { db } from "./firebase"
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore"

import type { Product } from "../types/product"

const productsRef = collection(db, "products")

export async function createProduct(data: Omit<Product, "id">) {
  await addDoc(productsRef, {
    ...data,
    createdAt: Timestamp.now(),
  })
}

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]
}