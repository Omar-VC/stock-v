import { useState } from "react"
import { createCustomer } from "../../services/customerService"

export default function CustomerForm({ onCreated }: any) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await createCustomer({
      name,
      phone,
      balance: 0,
      createdAt: Date.now(),
    })

    setName("")
    setPhone("")

    onCreated()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-3"
    >
      <h3 className="font-bold">
        Nuevo cliente
      </h3>

      <input
        className="border p-2 w-full"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        className="bg-black text-white p-2 rounded w-full"
      >
        Guardar cliente
      </button>
    </form>
  )
}