import { useEffect, useState } from "react"
import { getProducts } from "../../services/productService"
import {
  createSale,
  getSales,
  deleteSale,
  clearSales,
} from "../../services/salesService"
import { getCategories } from "../../services/categoryService"
import type { Product } from "../../types/product"

type Sale = {
  id: string
  productName: string
  quantity: number
  total: number
  createdAt?: any
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    loadProducts()
    loadSales()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  const loadCategories = async () => {
    const data = await getCategories()
    setCategories(data)
  }

  const loadSales = async () => {
    const data = await getSales()
    setSales(data as Sale[])
  }

  const handleSale = async () => {
    if (!selectedId) return

    try {
      await createSale(selectedId, quantity)
      setQuantity(1)
      setSelectedId("")
      loadProducts()
      loadSales()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta venta?")) return
    await deleteSale(id)
    loadSales()
  }

  const handleClear = async () => {
    if (!confirm("¿Borrar TODO el historial?")) return
    await clearSales()
    loadSales()
  }

  const formatDate = (ts: any) => {
    if (!ts) return ""
    return ts.toDate().toLocaleString()
  }

  // 💰 Total de hoy
  const getTodayTotal = () => {
    const today = new Date().toLocaleDateString()

    return sales.reduce((acc, s) => {
      if (!s.createdAt) return acc
      const date = s.createdAt.toDate().toLocaleDateString()
      return date === today ? acc + s.total : acc
    }, 0)
  }

  // 📊 Totales por día
  const getTotalsByDay = () => {
    const totals: Record<string, number> = {}

    sales.forEach((s) => {
      if (!s.createdAt) return

      const date = s.createdAt.toDate().toLocaleDateString()

      if (!totals[date]) totals[date] = 0
      totals[date] += s.total
    })

    return totals
  }

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-bold">Ventas</h2>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow space-y-3">

        <select
          className="border p-2 w-full"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Seleccionar producto</option>

          {categories.map((cat) => (
            <optgroup key={cat.id} label={cat.name}>
              {products
                .filter((p) => p.category === cat.name)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (stock: {p.stock})
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        <input
          type="number"
          min={1}
          className="border p-2 w-full"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button
          onClick={handleSale}
          className="bg-black text-white p-2 w-full rounded"
        >
          Registrar venta
        </button>
      </div>

      {/* 💰 RESUMEN */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h3 className="font-bold">Resumen</h3>

        <p className="text-lg font-bold text-green-600">
          Hoy: ${getTodayTotal()}
        </p>
      </div>

      {/* 📊 VENTAS POR DÍA */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Ventas por día</h3>

        {Object.entries(getTotalsByDay()).map(([date, total]) => (
          <div
            key={date}
            className="flex justify-between border-b py-1"
          >
            <span>{date}</span>
            <span className="font-bold">${total}</span>
          </div>
        ))}
      </div>

      {/* HISTORIAL */}
      <div className="bg-white rounded shadow">

        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold">Historial de ventas</h3>

          <button
            onClick={handleClear}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Limpiar todo
          </button>
        </div>

        <div className="divide-y">
          {sales.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">
              No hay ventas registradas
            </p>
          ) : (
            sales.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center p-4"
              >
                <div>
                  <p className="font-medium">{s.productName}</p>
                  <p className="text-sm text-gray-500">
                    Cantidad: {s.quantity}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(s.createdAt)}
                  </p>
                </div>

                <div className="text-right space-y-2">
                  <p className="font-bold text-green-600">
                    ${s.total}
                  </p>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-xs text-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}