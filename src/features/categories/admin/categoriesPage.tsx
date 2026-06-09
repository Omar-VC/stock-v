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
    <div className="space-y-6">

  <div className="bg-white rounded shadow overflow-hidden">

    <div className="bg-secondary px-4 py-3 border-b">
      <h2 className="font-bold text-dark">
        Nueva categoría
      </h2>
    </div>

    <div className="p-4">
      <CategoryForm onCreated={loadCategories} />
    </div>

  </div>

  <CategoryList
    categories={categories}
    onDeleted={loadCategories}
  />

</div>
  )
}