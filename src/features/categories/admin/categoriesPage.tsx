import { useEffect, useState } from "react"
import CategoryForm from "./categoryForm"
import CategoryList from "./categoryList"
import { getCategories } from "../../../services/categoryService"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])

  const loadCategories = async () => {
    const data = await getCategories()
    setCategories(data)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Categorías</h2>

      <CategoryForm onCreated={loadCategories} />

      <CategoryList
        categories={categories}
        onDeleted={loadCategories}
      />
    </div>
  )
}