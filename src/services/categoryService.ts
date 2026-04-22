import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "./firebase"

const COLLECTION = "categories"
const ref = collection(db, COLLECTION)

export const createCategory = async (name: string) => {
  return await addDoc(ref, {
    name,
    createdAt: Date.now(),
  })
}

export const getCategories = async () => {
  const q = query(ref, orderBy("name", "asc")) // 🔥 orden simple y eficiente
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as { id: string; name: string }[]
}

export const deleteCategory = async (id: string) => {
  return await deleteDoc(doc(db, COLLECTION, id))
}