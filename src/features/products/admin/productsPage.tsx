import { useEffect, useState } from "react";
import ProductForm from "./productForm";
import ProductList from "./productList";
import { getProducts, deleteProduct } from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar producto?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  // 🔍 filtro combinado (búsqueda + categoría)
  const filtered = products.filter((p) => {
    const matchesSearch = (p.name + p.variant)
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      !selectedCategory || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 w-full">
      <ProductForm
        onCreated={loadProducts}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />

      {/* Filtros */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="bg-secondary px-4 py-3 border-b">
          <h3 className="font-bold text-dark">Buscar productos</h3>
        </div>

        <div className="p-4 space-y-3">
          <input
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-gray-300 p-2 w-full rounded"
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
      </div>

      <ProductList
        products={filtered}
        onEdit={setEditingProduct}
        onDelete={handleDelete}
      />
    </div>
  );
}
