import type { Product } from "../../../types/product"

export default function ProductCard({ product }: { product: Product }) {
  const phone = "549XXXXXXXXXX"

  const message = `Hola! Estoy interesada en este producto:

🖤 ${product.name}
💲 Precio: $${product.salePrice}

¿Tenés disponible?`

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  const outOfStock = product.stock === 0

  return (
    <div
      className="rounded-3xl overflow-hidden transition duration-300 group shadow-sm hover:shadow-2xl"
      style={{ backgroundColor: "#feccd7" }}
    >

      {/* IMAGE */}
      <div className="relative w-full h-72 overflow-hidden bg-white">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        {outOfStock && (
          <span className="absolute top-3 left-3 bg-[#2e1f21] text-white text-xs px-3 py-1 rounded-full">
            Sin stock
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="p-5 space-y-3">

        <h3
          className="text-lg font-medium tracking-wide"
          style={{ color: "#2e1f21" }}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <p
            className="text-xl font-bold"
            style={{ color: "#a27a91" }}
          >
            ${product.salePrice}
          </p>

          {!outOfStock && (
            <span className="text-xs" style={{ color: "#664d52" }}>
              Stock: {product.stock}
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href={url}
          target="_blank"
          className="block text-center py-2.5 rounded-full font-medium transition duration-300"
          style={{
            backgroundColor: outOfStock ? "#bf9fa5" : "#a27a91",
            color: "white",
            letterSpacing: "0.5px"
          }}
          onMouseOver={(e) => {
            if (!outOfStock) e.currentTarget.style.backgroundColor = "#ffb2f1"
          }}
          onMouseOut={(e) => {
            if (!outOfStock) e.currentTarget.style.backgroundColor = "#a27a91"
          }}
        >
          {outOfStock ? "No disponible" : "Consultar por WhatsApp"}
        </a>

      </div>
    </div>
  )
}