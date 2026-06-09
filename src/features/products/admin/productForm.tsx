import { useEffect, useState } from "react";
import { createProduct, updateProduct } from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";

export default function ProductForm({
  onCreated,
  editingProduct,
  setEditingProduct,
}: any) {
  const [name, setName] = useState("");
  const [variant, setVariant] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  // 🔹 cargar categorías desde Firebase
  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  // 🔹 cargar producto en edición
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setVariant(editingProduct.variant || "");
      setCategory(editingProduct.category || "");
      setCostPrice(editingProduct.costPrice || 0);
      setSalePrice(editingProduct.salePrice || 0);
      setStock(editingProduct.stock || 0);
      setImageUrl(editingProduct.imageUrl || "");
    }
  }, [editingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      variant,
      category,
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      stock: Number(stock),
      imageUrl,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
    } else {
      await createProduct({
        ...data,
        createdAt: Date.now(),
      });
    }

    setName("");
    setVariant("");
    setCategory("");
    setCostPrice(0);
    setSalePrice(0);
    setStock(0);
    setImageUrl("");

    onCreated();
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="bg-secondary px-4 py-3 border-b">
        <h3 className="font-bold text-dark">
          {editingProduct ? "Editar producto" : "Nuevo producto"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Nombre del producto
          </label>

          <input
            className="border border-gray-300 p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Variante */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Variante / Detalle
          </label>

          <input
            className="border border-gray-300 p-2 w-full rounded"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Categoría</label>

          <select
            className="border border-gray-300 p-2 w-full rounded"
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

        {/* Precios y stock */}
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Precio compra
            </label>

            <input
              type="number"
              className="border border-gray-300 p-2 w-full rounded"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Precio venta
            </label>

            <input
              type="number"
              className="border border-gray-300 p-2 w-full rounded"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Stock</label>

            <input
              type="number"
              className="border border-gray-300 p-2 w-full rounded"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Imagen URL</label>

          <input
            className="border border-gray-300 p-2 w-full rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {/* Vista previa */}
        {imageUrl && (
          <div className="border rounded p-2 bg-gray-50">
            <img src={imageUrl} className="h-40 w-full object-cover rounded" />
          </div>
        )}

        <button
          type="submit"
          className="bg-primary text-dark font-semibold p-2 rounded w-full hover:bg-primaryHover transition"
        >
          {editingProduct ? "Actualizar producto" : "Guardar producto"}
        </button>
      </form>
    </div>
  );
}
