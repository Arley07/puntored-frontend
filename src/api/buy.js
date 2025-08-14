const API_BASE = import.meta.env.VITE_API_BASE || "https://puntored-backend.onrender.com";

export async function buy({ supplierId, cellPhone, value }) {
  const token = localStorage.getItem("token"); //  recupera token guardado en login

  const res = await fetch(`${API_BASE}/api/buy`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` //  agrega token al header
    },
    body: JSON.stringify({ supplierId, cellPhone, value: Number(value) }),
  });

  const text = await res.text();
  let payload;
  try { payload = JSON.parse(text); } catch { payload = { message: text }; }

  if (!res.ok) {
    const errMsg = payload?.message || payload?.error || "Error en la recarga";
    const e = new Error(errMsg);
    e.response = payload;
    throw e;
  }

  return payload;
}
