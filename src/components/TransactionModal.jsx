import { useEffect, useState } from "react";
import { listSuppliers } from "../api/transactions";
import { buy } from "../api/buy";

export default function TransactionModal({ open, onClose, onCreated }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ supplierId: "", cellPhone: "", value: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      setForm({ supplierId: "", cellPhone: "", value: "" });
      setLoadingSuppliers(true);
      listSuppliers()
        .then(setSuppliers)
        .catch(() => setError("No se pudo cargar la lista de proveedores"))
        .finally(() => setLoadingSuppliers(false));
    }
  }, [open]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.supplierId || !/^3\d{9}$/.test(form.cellPhone) || !form.value) {
      setError("Verifica proveedor, celular (3 + 9 dígitos) y valor.");
      return;
    }
    try {
      setSaving(true);
      const resp = await buy({
        supplierId: form.supplierId,
        cellPhone: form.cellPhone,
        value: Number(form.value),
      });
      // Notificamos al padre: para refrescar la tabla y opcionalmente abrir ticket
      onCreated?.({
        createdFromBuy: true,
        ticket: {
          message: resp.message,
          transactionalId: resp.transactionalId,
          supplierId: form.supplierId,
          cellPhone: resp.cellPhone ?? form.cellPhone,
          value: resp.value ?? form.value,
          status: "SUCCESS",
          createdAt: new Date().toISOString(),
        },
      });
      onClose();
    } catch (e) {
      // El backend podría haber persistido como FAILED; refrescamos la tabla igual
      onCreated?.();
      setError(e.message || "Error realizando la recarga");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Agregar nueva transacción</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Proveedor</label>
            <select
              name="supplierId"
              value={form.supplierId}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring"
              disabled={loadingSuppliers || saving}
            >
              <option value="">Selecciona…</option>
              {suppliers.map((s) => (
                <option key={s.id ?? s.supplierId ?? s.name} value={s.id ?? s.supplierId ?? s.name}>
                  {s.name ?? s.id ?? s.supplierId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Celular (3 + 9 dígitos)</label>
            <input
              name="cellPhone"
              value={form.cellPhone}
              onChange={onChange}
              placeholder="3123456789"
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Valor</label>
            <input
              name="value"
              type="number"
              min={1000}
              max={100000}
              step={1000}
              value={form.value}
              onChange={onChange}
              placeholder="15000"
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring"
              disabled={saving}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2 hover:bg-gray-50"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Procesando…" : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
