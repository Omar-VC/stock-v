import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc,
  updateDoc,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Customer } from "../types/customer"

const ref = collection(db, "customers")

export const getCustomers = async (): Promise<Customer[]> => {
  const q = query(
    ref,
    orderBy("createdAt", "desc")
  )

  const snap = await getDocs(q)

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Customer[]
}

export const createCustomer = async (
  data: Omit<Customer, "id">
) => {
  await addDoc(ref, data)
}

export const deleteCustomer = async (id: string) => {
  await deleteDoc(doc(db, "customers", id))
}

export const getCustomerById = async (id: string) => {
  const snap = await getDoc(doc(db, "customers", id))

  if (!snap.exists()) {
    return null
  }

  return {
    id: snap.id,
    ...snap.data(),
  }
}

export const updateCustomerBalance = async (
  id: string,
  balance: number
) => {
  await updateDoc(
    doc(db, "customers", id),
    { balance }
  )
}