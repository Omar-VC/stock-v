import type { Product } from "../../../types/product"

export default function ProductCard({ product }: { product: Product }) {
  const phone = "549XXXXXXXXXX"

  const message = `Hola! Estoy interesado en este producto:

🛍️ ${product.name}
💲 Precio: $${product.salePrice}

¿Tenés disponible?`

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  const outOfStock = product.stock === 0

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group">

      <div className="relative w-full h-60 bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {outOfStock && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            Sin stock
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-medium text-lg text-dark">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            ${product.salePrice}
          </p>

          {!outOfStock && (
            <span className="text-xs text-gray-500">
              Stock: {product.stock}
            </span>
          )}
        </div>

        <a
          href={url}
          target="_blank"
          className={`block text-center py-2 rounded-lg font-medium ${
            outOfStock
              ? "bg-gray-300 text-gray-600"
              : "bg-primary hover:bg-primaryHover text-white"
          }`}
        >
          {outOfStock ? "No disponible" : "Consultar por WhatsApp"}
        </a>
      </div>
    </div>
  )
}