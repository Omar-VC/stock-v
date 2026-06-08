import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import {
  createSale,
  getSales,
  
  clearSales,
  cancelSale,
} from "../../services/salesService";
import { getCategories } from "../../services/categoryService";
import type { Product } from "../../types/product";
import { getCustomers } from "../../services/customerService";
import { createMovement } from "../../services/customerMovementService";
import { updateCustomerBalance } from "../../services/customerService";

type Sale = {
  id: string;
  productName: string;
  quantity: number;
  total: number;
  createdAt?: any;

  saleType?: string;
  customerId?: string;
  status?: string;
};

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customers, setCustomers] = useState<any[]>([]);
  const [saleType, setSaleType] = useState("cash");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    loadProducts();
    loadSales();
    loadCategories();
    loadCustomers();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const loadSales = async () => {
    const data = await getSales();
    setSales(data as Sale[]);
  };

  const handleSale = async () => {
    if (!selectedId) {
      alert("Seleccionar producto");
      return;
    }

    try {
      const product = products.find((p) => p.id === selectedId);
      if (!product) return;

      const total = (product.salePrice || 0) * quantity;

      // 1) SIEMPRE crear venta
      await createSale(selectedId, quantity, saleType, customerId);

      // 2) SOLO cuenta corriente afecta cliente
      if (saleType === "account") {
        if (!customerId) {
          alert("Seleccionar cliente");
          return;
        }

        const customer = customers.find((c) => c.id === customerId);

        if (customer) {
          await createMovement({
            customerId,
            type: "debt",
            description: `${product.name} x${quantity}`,
            amount: total,
            createdAt: Date.now(),
          });

          await updateCustomerBalance(customerId, customer.balance + total);
        }
      }

      setQuantity(1);
      setSelectedId("");
      setCustomerId("");

      loadProducts();
      loadSales();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("¿Anular esta venta?")) return;

    try {
      await cancelSale(id);
      loadSales();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleClear = async () => {
    if (!confirm("¿Borrar TODO el historial?")) return;
    await clearSales();
    loadSales();
  };

  const formatDate = (ts: any) => {
    if (!ts) return "";
    return ts.toDate().toLocaleString();
  };

  const getTodayTotal = () => {
    const today = new Date().toLocaleDateString();

    return sales.reduce((acc, s) => {
      if (!s.createdAt) return acc;
      if (s.status === "cancelled") return acc;

      const date = s.createdAt.toDate().toLocaleDateString();
      return date === today ? acc + s.total : acc;
    }, 0);
  };

  const getTotalsByDay = () => {
    const totals: Record<string, number> = {};

    sales.forEach((s) => {
      if (!s.createdAt) return;
      if (s.status === "cancelled") return;

      const date = s.createdAt.toDate().toLocaleDateString();

      if (!totals[date]) totals[date] = 0;
      totals[date] += s.total;
    });

    return totals;
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-bold">Ventas</h2>

      {/* FORM */}
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
          Registrar venta
        </button>
      </div>

      {/* RESUMEN */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h3 className="font-bold">Resumen</h3>

        <p className="text-lg font-bold text-green-600">
          Hoy: ${getTodayTotal()}
        </p>
      </div>

      {/* POR DÍA */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Ventas por día</h3>

        {Object.entries(getTotalsByDay()).map(([date, total]) => (
          <div key={date} className="flex justify-between border-b py-1">
            <span>{date}</span>
            <span className="font-bold">${total}</span>
          </div>
        ))}
      </div>

      {/* HISTORIAL */}
      <div className="bg-white rounded shadow">

        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold">Historial de ventas</h3>

          <button
            onClick={handleClear}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Limpiar todo
          </button>
        </div>

        <div className="divide-y">
          {sales.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">
              No hay ventas registradas
            </p>
          ) : (
            sales.map((s) => (
              <div
                key={s.id}
                className={`flex justify-between items-center p-4 ${
                  s.status === "cancelled" ? "opacity-50" : ""
                }`}
              >
                <div>
                  <p className="font-medium">{s.productName}</p>
                  <p className="text-sm text-gray-500">
                    Cantidad: {s.quantity}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(s.createdAt)}
                  </p>
                </div>

                <div className="text-right space-y-2">
                  <p className="font-bold text-green-600">${s.total}</p>

                  <button
                    onClick={() => handleCancel(s.id)}
                    disabled={s.status === "cancelled"}
                    className={`text-xs ${
                      s.status === "cancelled"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500"
                    }`}
                  >
                    {s.status === "cancelled" ? "Anulada" : "Anular"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
