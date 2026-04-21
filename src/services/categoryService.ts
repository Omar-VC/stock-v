import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore"
import { db } from "./firebase"

const COLLECTION = "categories"

export const createCategory = async (name: string) => {
  return await addDoc(collection(db, COLLECTION), {
    name,
    createdAt: new Date().toISOString(),
  })
}

export const getCategories = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION))

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as { id: string; name: string }[]
}

export const deleteCategory = async (id: string) => {
  return await deleteDoc(doc(db, COLLECTION, id))
}