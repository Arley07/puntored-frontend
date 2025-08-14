// src/api/transactions.js
const API_BASE = import.meta.env.VITE_API_BASE || "https://puntored-backend.onrender.com";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function listTransactions({ page = 0, size = 7 } = {}) {
  const res = await fetch(`${API_BASE}/api/admin/transactions?page=${page}&size=${size}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  if (!res.ok) throw new Error("No se pudo cargar la lista de transacciones");
  return res.json(); // Page<Transaction>
}

export async function getTransaction(id) {
  const res = await fetch(`${API_BASE}/api/admin/transactions/${id}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  if (!res.ok) throw new Error("No se pudo obtener el detalle");
  return res.json();
}

export async function softDeleteTransaction(id) {
  const res = await fetch(`${API_BASE}/api/admin/transactions/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  if (!res.ok) throw new Error("No se pudo eliminar (ocultar) la transacción");
  return res.json();
}

export async function listSuppliers() {
  const res = await fetch(`${API_BASE}/api/suppliers`);
  if (!res.ok) throw new Error("No se pudo cargar proveedores");
  return res.json(); // array de { id, name } o similar según tu DTO
}
