import { useEffect, useState } from "react"
import CustomerForm from "./customerForm"
import CustomerList from "./customerList"
import {
  getCustomers,
  deleteCustomer,
} from "../../services/customerService"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])

  const loadCustomers = async () => {
    const data = await getCustomers()
    setCustomers(data)
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar cliente?")) return

    await deleteCustomer(id)
    loadCustomers()
  }

  return (
    <div className="space-y-6">

      <CustomerForm
        onCreated={loadCustomers}
      />

      <CustomerList
        customers={customers}
        onDelete={handleDelete}
      />

    </div>
  )
}