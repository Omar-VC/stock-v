import { useEffect, useState } from "react"
import ProductForm from "./productForm"
import ProductList from "./productList"
import { getProducts } from "../../../services/productService"
import type { Product } from "../../../types/product"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  const loadProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Productos</h2>

      <ProductForm onCreated={loadProducts} />

      <ProductList products={products} />
    </div>
  )
}