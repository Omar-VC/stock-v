import { useState } from "react"
import { createProduct } from "../../../services/productService"

export default function ProductForm({ onCreated }: any) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || price <= 0 || quantity < 0) {
      alert("Completar bien los datos")
      return
    }

    await createProduct({
      name,
      category: "indumentaria",
      price,
      stock: quantity,
      createdAt: Date.now(),
    })

    setName("")
    setPrice(0)
    setQuantity(0)

    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* NOMBRE */}
      <div>
        <label className="block text-sm font-medium">
          Nombre del producto
        </label>
        <input
          className="border p-2 w-full"
          placeholder="Ej: Boxer Nike"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* PRECIO */}
      <div>
        <label className="block text-sm font-medium">
          Precio de venta
        </label>
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Ej: 5000"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <p className="text-xs text-gray-500">
          Precio por unidad
        </p>
      </div>

      {/* STOCK */}
      <div>
        <label className="block text-sm font-medium">
          Cantidad inicial (stock)
        </label>
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Ej: 10"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <p className="text-xs text-gray-500">
          Cuántas unidades tenés disponibles
        </p>
      </div>

      <button className="bg-black text-white p-2 w-full">
        Guardar producto
      </button>
    </form>
  )
}