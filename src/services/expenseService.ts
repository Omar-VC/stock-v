import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Expense } from "../types/expense"

const COLLECTION = "expenses"

export const createExpense = async (expense: Omit<Expense, "id">) => {
  return await addDoc(collection(db, COLLECTION), expense)
}

export const getExpenses = async (): Promise<Expense[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION))
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Expense[]
}

export const updateExpense = async (id: string, data: Partial<Expense>) => {
  const ref = doc(db, COLLECTION, id)
  return await updateDoc(ref, data)
}

export const deleteExpense = async (id: string) => {
  const ref = doc(db, COLLECTION, id)
  return await deleteDoc(ref)
}