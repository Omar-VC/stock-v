import { useEffect, useMemo, useState } from "react"
import { getProducts } from "../../services/productService"
import { getCategories } from "../../services/categoryService"

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ])

        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = (p.name + p.variant)
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        !selectedCategory || p.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [products, search, selectedCategory])

  const visibleProducts = useMemo(() => {
    return filtered.slice(0, 50)
  }, [filtered])

  if (loading) {
    return <p className="p-4 text-center">Cargando...</p>
  }

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

        {/* 🧩 FILTRO POR CATEGORÍA */}
        <select
          className="border p-2 w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>

          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 📦 LISTA */}
      <div className="bg-white rounded shadow overflow-hidden">

        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">
            Productos
          </h2>
        </div>

        <div className="divide-y">

          {visibleProducts.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center p-4 hover:bg-gray-50"
            >

              <div>
                <p className="font-medium text-dark">
                  {p.name}
                </p>

                <p className="text-sm text-gray-500">
                  {p.variant}
                </p>

                <p className="text-xs text-gray-400">
                  {p.category}
                </p>
              </div>

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