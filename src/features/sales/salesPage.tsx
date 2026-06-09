import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { createSale, getSales } from "../../services/salesService";
import { getCategories } from "../../services/categoryService";
import type { Product } from "../../types/product";
import { getCustomers } from "../../services/customerService";

type CartItem = {
  product: Product;
  quantity: number;
};

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [saleType, setSaleType] = useState("cash");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    loadProducts();
    loadSales();
    loadCategories();
    loadCustomers();
  }, []);

  const loadProducts = async () => setProducts(await getProducts());
  const loadCategories = async () => setCategories(await getCategories());
  const loadCustomers = async () => setCustomers(await getCustomers());
  const loadSales = async () => setSales(await getSales());

  // 👉 AGREGAR AL CARRITO
  const addToCart = () => {
    if (!selectedId) return;

    const product = products.find((p) => p.id === selectedId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === selectedId);

      if (existing) {
        return prev.map((i) =>
          i.product.id === selectedId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }

      return [...prev, { product, quantity }];
    });

    setSelectedId("");
    setQuantity(1);
  };

  // 👉 ELIMINAR ITEM
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // 👉 TOTAL
  const getTotal = () =>
    cart.reduce(
      (acc, item) => acc + (item.product.salePrice || 0) * item.quantity,
      0,
    );

  // 👉 VENTA FINAL
  const handleSale = async () => {
    if (cart.length === 0) return;

    if (saleType === "account" && !customerId) {
      alert("Seleccionar cliente");
      return;
    }

    try {
      await createSale({
        items: cart,
        saleType,
        customerId,
      });

      setCart([]);
      setCustomerId("");
      loadSales();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Ventas</h2>

      {/* FORM PRODUCTO */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <select
          className="border p-2 w-full"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Seleccionar producto</option>

          {categories.map((cat) => (
            <optgroup key={cat.id} label={cat.name}>
              {products
                .filter((p) => p.category === cat.name)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} | {p.variant} | Stock: {p.stock}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        <input
          type="number"
          min={1}
          className="border p-2 w-full"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button
          onClick={addToCart}
          className="bg-gray-800 text-white p-2 w-full rounded"
        >
          Agregar al carrito
        </button>
      </div>

      {/* CARRITO */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Carrito</h3>

        {cart.length === 0 ? (
          <p className="text-gray-500">Vacío</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between border-b py-2"
            >
              <span>
                {item.product.name} x{item.quantity}
              </span>

              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-500 text-sm"
              >
                Quitar
              </button>
            </div>
          ))
        )}

        <p className="mt-2 font-bold">Total: ${getTotal()}</p>
      </div>

      {/* TIPO DE VENTA */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <select
          className="border p-2 w-full"
          value={saleType}
          onChange={(e) => setSaleType(e.target.value)}
        >
          <option value="cash">Contado</option>
          <option value="account">Cuenta corriente</option>
        </select>

        {saleType === "account" && (
          <select
            className="border p-2 w-full"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Seleccionar cliente</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleSale}
          className="bg-black text-white p-2 w-full rounded"
        >
          Finalizar venta
        </button>
      </div>
      {/* HISTORIAL */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b">
          <h3 className="font-bold">Historial de ventas</h3>
        </div>

        <div className="divide-y">
          {sales.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">
              No hay ventas registradas
            </p>
          ) : (
            sales.map((s) => {
              const isCarrito = Array.isArray(s.items);

              return (
                <div
                  key={s.id}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    {isCarrito ? (
                      <>
                        <p className="font-medium">
                          {s.items?.map((i: any) => i.productName).join(", ")}
                        </p>

                        <p className="text-sm text-gray-500">
                          {s.items
                            ?.map((i: any) => `${i.productName} x${i.quantity}`)
                            .join(" | ")}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">{s.productName}</p>
                        <p className="text-sm text-gray-500">
                          Cantidad: {s.quantity}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-green-600">${s.total}</p>

                    <p className="text-xs text-gray-400">
                      {s.saleType === "cash" ? "Contado" : "Cuenta corriente"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
