import { useEffect, useState } from "react"
import { getProducts } from "../../../services/productService"
import ProductCard from "./productCard"
import type { Product } from "../../../types/product"

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Título */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold text-dark">
          Santa Julia
        </h2>
        <p className="text-gray-500">
          Indumentaria y ropa interior
        </p>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay productos disponibles
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}