import { useEffect, useState } from "react"
import { getProducts } from "../../services/productService"

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  const filtered = products.filter((p) =>
    (p.name + p.variant)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* 🔍 BUSCADOR */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-bold text-lg">
          Buscar producto
        </h2>

        <input
          className="border p-2 w-full"
          placeholder="Ej: medias negro T:90"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📦 LISTA TIPO CATALOGO */}
      <div className="bg-white rounded shadow overflow-hidden">

        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">
            Productos
          </h2>
        </div>

        <div className="divide-y">

          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center p-4 hover:bg-gray-50"
            >

              {/* Info */}
              <div>
                <p className="font-medium text-dark">
                  {p.name}
                </p>

                <p className="text-sm text-gray-500">
                  {p.variant}
                </p>
              </div>

              {/* Datos */}
              <div className="text-right space-y-1">
                <p className="font-bold text-primary">
                  ${p.salePrice}
                </p>

                <p
                  className={`text-sm ${
                    p.stock === 0
                      ? "text-red-500"
                      : "text-gray-600"
                  }`}
                >
                  Stock: {p.stock}
                </p>
              </div>

            </div>
          ))}

          {filtered.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              No se encontraron productos
            </p>
          )}

        </div>
      </div>

    </div>
  )
}