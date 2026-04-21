import { useEffect, useState } from "react"
import {
  createProduct,
  updateProduct,
} from "../../../services/productService"
import { getCategories } from "../../../services/categoryService"

export default function ProductForm({
  onCreated,
  editingProduct,
  setEditingProduct,
}: any) {

  const [name, setName] = useState("")
  const [variant, setVariant] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [costPrice, setCostPrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)
  const [stock, setStock] = useState(0)
  const [imageUrl, setImageUrl] = useState("")

  // 🔹 cargar categorías desde Firebase
  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories()
      setCategories(data)
    }

    loadCategories()
  }, [])

  // 🔹 cargar producto en edición
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "")
      setVariant(editingProduct.variant || "")
      setCategory(editingProduct.category || "")
      setCostPrice(editingProduct.costPrice || 0)
      setSalePrice(editingProduct.salePrice || 0)
      setStock(editingProduct.stock || 0)
      setImageUrl(editingProduct.imageUrl || "")
    }
  }, [editingProduct])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      name,
      variant,
      category,
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      stock: Number(stock),
      imageUrl,
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, data)
      setEditingProduct(null)
    } else {
      await createProduct({
        ...data,
        createdAt: Date.now(),
      })
    }

    setName("")
    setVariant("")
    setCategory("")
    setCostPrice(0)
    setSalePrice(0)
    setStock(0)
    setImageUrl("")

    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-5 rounded shadow">

      <h3 className="font-bold text-lg">
        {editingProduct ? "Editar producto" : "Nuevo producto"}
      </h3>

      {/* Nombre */}
      <div>
        <label className="text-sm text-gray-600">Nombre del producto</label>
        <input
          className="border p-2 w-full mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Variante */}
      <div>
        <label className="text-sm text-gray-600">Variante / Detalle</label>
        <input
          className="border p-2 w-full mt-1"
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
        />
      </div>

      {/* Categoría dinámica */}
      <div>
        <label className="text-sm text-gray-600">Categoría</label>
        <select
          className="border p-2 w-full mt-1"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Seleccionar</option>

          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Precios */}
      <div className="grid grid-cols-2 gap-3">

        <div>
          <label className="text-sm text-gray-600">Precio compra</label>
          <input
            type="number"
            className="border p-2 w-full mt-1"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Precio venta</label>
          <input
            type="number"
            className="border p-2 w-full mt-1"
            value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
          />
        </div>

      </div>

      {/* Stock */}
      <div>
        <label className="text-sm text-gray-600">Stock</label>
        <input
          type="number"
          className="border p-2 w-full mt-1"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
      </div>

      {/* Imagen */}
      <div>
        <label className="text-sm text-gray-600">Imagen URL</label>
        <input
          className="border p-2 w-full mt-1"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      {/* Preview */}
      {imageUrl && (
        <img
          src={imageUrl}
          className="h-40 w-full object-cover rounded"
        />
      )}

      <button className="bg-primary text-white p-2 w-full rounded">
        {editingProduct ? "Actualizar producto" : "Guardar producto"}
      </button>
    </form>
  )
}