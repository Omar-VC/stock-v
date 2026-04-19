import type { Product } from "../../../types/product"

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="space-y-2">
      {products.map((p) => (
        <div key={p.id} className="border p-2">
          <p className="font-bold">{p.name}</p>
          <p>Precio: ${p.price}</p>
          <p>Stock: {p.stock}</p>
        </div>
      ))}
    </div>
  )
}