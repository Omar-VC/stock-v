import { useEffect, useState } from "react"
import { getProducts } from "../../services/productService"
import { createSale } from "../../services/salesService"
import type { Product } from "../../types/product"

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  const handleSale = async () => {
    if (!selectedId) return

    try {
      await createSale(selectedId, quantity)
      alert("Venta registrada")
      setQuantity(1)
      loadProducts()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Ventas</h2>

      <select
        className="border p-2 w-full"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">Seleccionar producto</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} (stock: {p.stock})
          </option>
        ))}
      </select>

      <input
        type="number"
        className="border p-2 w-full"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <button
        onClick={handleSale}
        className="bg-black text-white p-2 w-full"
      >
        Registrar venta
      </button>
    </div>
  )
}