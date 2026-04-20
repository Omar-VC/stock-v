import { useEffect, useState } from "react"
import { getProducts } from "../../../services/productService"
import ProductCard from "./productCard"
import type { Product } from "../../../types/product"

type Category = "all" | "lenceria" | "ropa_interior" | "perfume"

export default function CatalogPage() {

  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<Category>("all")

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      category === "all" ? true : p.category === category
    )

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* HERO */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-4xl font-bold text-[#2e1f21]">
          Santa Julia
        </h1>
        <p className="text-[#664d52]">
          Lencería y ropa interior
        </p>
      </div>

      {/* CATEGORÍAS */}
      <div className="flex justify-center gap-2 flex-wrap">

        {[
          { key: "all", label: "Todo" },
          { key: "lenceria", label: "Lencería" },
          { key: "ropa_interior", label: "Ropa interior" },
          { key: "perfume", label: "Perfumes" },
        ].map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key as Category)}
            className={`px-4 py-1 rounded-full border text-sm transition ${
              category === c.key
                ? "bg-[#a27a91] text-white"
                : "bg-white text-[#2e1f21]"
            }`}
          >
            {c.label}
          </button>
        ))}

      </div>

      {/* SEARCH */}
      <div className="flex justify-center">
        <input
          className="w-full max-w-md px-4 py-2 border rounded-lg"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div>
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay productos disponibles
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}