import { useEffect, useState } from "react"
import {
  createProduct,
  updateProduct,
} from "../../../services/productService"

export default function ProductForm({
  onCreated,
  editingProduct,
  setEditingProduct,
}: any) {
  const [name, setName] = useState("")
  const [variant, setVariant] = useState("")
  const [costPrice, setCostPrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)
  const [stock, setStock] = useState(0)
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name)
      setVariant(editingProduct.variant)
      setCostPrice(editingProduct.costPrice)
      setSalePrice(editingProduct.salePrice)
      setStock(editingProduct.stock)
      setImageUrl(editingProduct.imageUrl)
    }
  }, [editingProduct])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const data = {
      name,
      variant,
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
          placeholder="Ej: Medias"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Variante */}
      <div>
        <label className="text-sm text-gray-600">Variante / Detalle</label>
        <input
          className="border p-2 w-full mt-1"
          placeholder="Ej: Negro T:90"
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
        />
      </div>

      {/* Precios */}
      <div className="grid grid-cols-2 gap-3">

        <div>
          <label className="text-sm text-gray-600">
            Precio de compra
          </label>
          <input
            type="number"
            className="border p-2 w-full mt-1"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Precio de venta
          </label>
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
        <label className="text-sm text-gray-600">Cantidad en stock</label>
        <input
          type="number"
          className="border p-2 w-full mt-1"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
      </div>

      {/* Imagen */}
      <div>
        <label className="text-sm text-gray-600">URL de la imagen</label>
        <input
          className="border p-2 w-full mt-1"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      {/* Preview */}
      {imageUrl && (
        <img
          src={imageUrl}
          className="h-40 object-cover w-full rounded border"
        />
      )}

      <button className="bg-primary text-white p-2 w-full rounded">
        {editingProduct ? "Actualizar producto" : "Guardar producto"}
      </button>
    </form>
  )
}