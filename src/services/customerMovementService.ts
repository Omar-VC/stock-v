import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore"
import { db } from "./firebase"

const ref = collection(db, "customerMovements")

export const createMovement = async (data: any) => {
  await addDoc(ref, data)
}

export const getCustomerMovements = async (
  customerId: string
) => {
  const q = query(
    ref,
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc")
  )

  const snap = await getDocs(q)

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
}