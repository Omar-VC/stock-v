import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import {
  createSale,
  getSales,
  cancelSale,
  clearSales,
} from "../../services/salesService";
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
  const [historyFilter, setHistoryFilter] = useState("all");

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

  const normalizeDate = (date: any) => {
    if (!date) return null;

    if (date?.toDate) return date.toDate();
    return new Date(date);
  };

  const isToday = (date: any) => {
    const d = normalizeDate(date);
    if (!d) return false;

    return d.toDateString() === new Date().toDateString();
  };

  //CAJA DEL DIA
  const cashToday = sales.reduce((acc, s) => {
    if (s.status === "cancelled") return acc;
    if (s.saleType !== "cash") return acc;
    if (!isToday(s.createdAt)) return acc;

    return acc + (s.total || 0);
  }, 0);

  //CUENTA CORRIENTE DEL DIA
  const accountToday = sales.reduce((acc, s) => {
    if (s.status === "cancelled") return acc;
    if (s.saleType !== "account") return acc;
    if (!isToday(s.createdAt)) return acc;

    return acc + (s.total || 0);
  }, 0);

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

  const getSaleTypeLabel = (type?: string) => {
    switch (type) {
      case "cash":
        return "Contado";
      case "account":
        return "Cuenta corriente";
      default:
        return "Sin definir";
    }
  };

  // 👉 TOTAL
  const getTotal = () =>
    cart.reduce(
      (acc, item) => acc + (item.product.salePrice || 0) * item.quantity,
      0,
    );

  const totalToday = cashToday + accountToday;

  // CREAR VENTAS FILTRADAS

  const filteredSales = sales.filter((sale) => {
    const date = normalizeDate(sale.createdAt);

    if (!date) return false;

    const now = new Date();

    switch (historyFilter) {
      case "today":
        return date.toDateString() === now.toDateString();

      case "week": {
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        return date >= start;
      }

      case "month":
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );

      default:
        return true;
    }
  });

  // AGREGA CALCULOS DE VENTAS HECHAS SEGUN FILTRADO
  const activeSales = filteredSales.filter(
    (sale) => sale.status !== "cancelled",
  );

  const cancelledSales = filteredSales.filter(
    (sale) => sale.status === "cancelled",
  );

  const salesCount = activeSales.length;

  const cancelledCount = cancelledSales.length;

  const filteredTotal = activeSales.reduce(
    (acc, sale) => acc + (sale.total || 0),
    0,
  );

  const cancelledTotal = cancelledSales.reduce(
    (acc, sale) => acc + (sale.total || 0),
    0,
  );

  const averageSale = salesCount > 0 ? filteredTotal / salesCount : 0;

  // 👉 VENTA FINAL
  const handleSale = async () => {
    if (cart.length === 0) return;

    if (saleType === "account" && !customerId) {
      alert("Seleccionar cliente");
      return;
    }

    try {
      await createSale({
        items: cart.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.salePrice || 0,
        })),
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

  //CANCELAR VENTA
  const handleCancel = async (id: string) => {
    if (!confirm("¿Anular esta venta?")) return;

    try {
      await cancelSale(id);
      loadSales();
    } catch (err: any) {
      alert(err.message);
    }
  };

  //LIMPIAR HISTORIAL DE VENTAS
  const handleClearSales = async () => {
    if (!confirm("¿Borrar TODO el historial de ventas?")) return;

    try {
      await clearSales();
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

      <div className="bg-white p-4 rounded shadow space-y-2">
        <h3 className="font-bold">Caja del día</h3>

        <p className="text-green-600 font-bold">Efectivo: ${cashToday}</p>

        <p className="text-orange-600 font-bold">
          Cuenta corriente: ${accountToday}
        </p>

        <p className="border-t pt-2 font-bold">Total: ${totalToday}</p>
      </div>

      {/* HISTORIAL */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold">Historial de ventas</h3>
          <select
            className="mt-3 border p-2 rounded"
            value={historyFilter}
            onChange={(e) => setHistoryFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="today">Hoy</option>
            <option value="week">Últimos 7 días</option>
            <option value="month">Este mes</option>
          </select>
          <button
            onClick={handleClearSales}
            className="text-xs bg-red-600 text-white px-3 py-1 rounded"
          >
            Limpiar
          </button>
        </div>

        <div className="mt-4 mb-4 space-y-4">
          <h4 className="text-sm text-gray-500 font-semibold">
            Resumen del período
          </h4>

          {/* TARJETAS SUPERIORES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Ventas</p>
              <p className="text-2xl font-bold">{salesCount}</p>
            </div>

            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-red-500">Anuladas</p>
              <p className="text-2xl font-bold text-red-600">
                {cancelledCount}
              </p>
            </div>

            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-blue-500">Promedio</p>
              <p className="text-2xl font-bold">${averageSale.toFixed(2)}</p>
            </div>
          </div>

          {/* TARJETAS INFERIORES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-green-500">Total vendido</p>
              <p className="text-2xl font-bold text-green-600">
                ${filteredTotal.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-red-500">Importe anulado</p>
              <p className="text-2xl font-bold text-red-600">
                ${cancelledTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {filteredSales.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">
              No hay ventas registradas
            </p>
          ) : (
            filteredSales.map((s) => {
              const isCarrito = Array.isArray(s.items);

              return (
                <div
                  key={s.id}
                  className={`p-4 flex justify-between items-center ${
                    s.status === "cancelled" ? "opacity-50 bg-red-50" : ""
                  }`}
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
                      {getSaleTypeLabel(s.saleType)}
                    </p>
                    {s.status === "cancelled" && (
                      <p className="text-xs font-bold text-red-600">
                        VENTA ANULADA
                      </p>
                    )}
                    {s.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(s.id)}
                        className="text-red-500 text-sm"
                      >
                        Anular
                      </button>
                    )}
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
