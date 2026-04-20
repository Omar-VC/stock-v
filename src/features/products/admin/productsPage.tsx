import { useEffect, useState } from "react"
import ProductForm from "./productForm"
import ProductList from "./productList"
import {
  getProducts,
  deleteProduct,
} from "../../../services/productService"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [search, setSearch] = useState("")

  const loadProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar producto?")) {
      await deleteProduct(id)
      loadProducts()
    }
  }

  const filtered = products.filter((p) =>
    (p.name + p.variant)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      <ProductForm
        onCreated={loadProducts}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />

      <input
        className="border p-2 w-full"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ProductList
        products={filtered}
        onEdit={setEditingProduct}
        onDelete={handleDelete}
      />
    </div>
  )
}